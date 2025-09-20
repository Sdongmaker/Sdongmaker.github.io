import type { GeneratedContent } from '../types';

// 获取当前 API 配置
const getCurrentApiConfig = () => {
  try {
    const saved = localStorage.getItem('selectedApi');
    if (saved) {
      const config = JSON.parse(saved);
      return {
        baseUrl: config.baseUrl || 'https://yqdkzwnuarth.eu-central-1.clawcloudrun.com',
        apiKey: config.apiKey || 'sk-chocokitty',
        type: config.type || 'proxy'
      };
    }
  } catch (e) {
    console.error('Failed to get API config from localStorage:', e);
  }
  
  // 默认配置
  return {
    baseUrl: 'https://yqdkzwnuarth.eu-central-1.clawcloudrun.com',
    apiKey: 'sk-chocokitty',
    type: 'proxy'
  };
};

// 检查是否使用自定义 API 端点
const isCustomEndpoint = () => {
  const config = getCurrentApiConfig();
  return config.baseUrl && !config.baseUrl.includes('googleapis.com');
};

// 统一的 API 调用函数
async function callGeminiAPI(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  maskBase64: string | null,
  secondaryImage: { base64: string; mimeType: string } | null
): Promise<GeneratedContent> {
  try {
    const parts: any[] = [
      {
        inline_data: {
          data: base64ImageData,
          mime_type: mimeType,
        },
      },
    ];

    let fullPrompt = prompt;
    if (maskBase64) {
      parts.push({
        inline_data: {
          data: maskBase64,
          mime_type: 'image/png',
        },
      });
      fullPrompt = `Apply the following instruction only to the masked area of the image: "${prompt}". Preserve the unmasked area.`;
    }
    
    if (secondaryImage) {
      parts.push({
        inline_data: {
          data: secondaryImage.base64,
          mime_type: secondaryImage.mimeType,
        },
      });
    }

    parts.push({ text: fullPrompt });

    const requestBody = {
      contents: [{ parts }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    };

    const config = getCurrentApiConfig();
    console.log('Making API request to:', `${config.baseUrl}/v1beta/models/gemini-2.5-flash-image-preview:generateContent`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 根据API类型设置不同的认证头
    if (config.type === 'official') {
      headers['x-goog-api-key'] = config.apiKey;
    } else {
      // 代理服务使用Authorization头
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(`${config.baseUrl}/v1beta/models/gemini-2.5-flash-image-preview:generateContent`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      let errorMessage = `API request failed: ${response.status} - ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        // 如果无法解析错误响应，使用原始错误文本
        errorMessage = `API request failed: ${response.status} - ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    const result: GeneratedContent = { imageUrl: null, text: null };
    const responseParts = data.candidates?.[0]?.content?.parts;

    if (responseParts) {
      for (const part of responseParts) {
        if (part.text) {
          result.text = (result.text ? result.text + "\n" : "") + part.text;
        } else if (part.inlineData || part.inline_data) {
          const inlineData = part.inlineData || part.inline_data;
          result.imageUrl = `data:${inlineData.mimeType || inlineData.mime_type};base64,${inlineData.data}`;
        }
      }
    }

    if (!result.imageUrl) {
      let errorMessage;
      if (result.text) {
        errorMessage = `The model responded: "${result.text}"`;
      } else {
        const finishReason = data.candidates?.[0]?.finishReason;
        errorMessage = "The model did not return an image. It might have refused the request. Please try a different image or prompt.";
        
        if (finishReason === 'SAFETY') {
          errorMessage = "The request was blocked for safety reasons. Please modify your prompt or image.";
        }
      }
      throw new Error(errorMessage);
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
}

export async function editImage(
    base64ImageData: string, 
    mimeType: string, 
    prompt: string,
    maskBase64: string | null,
    secondaryImage: { base64: string; mimeType: string } | null
): Promise<GeneratedContent> {
  return callGeminiAPI(base64ImageData, mimeType, prompt, maskBase64, secondaryImage);
}

export async function generateVideo(
    prompt: string,
    image: { base64: string; mimeType: string } | null,
    aspectRatio: '16:9' | '9:16',
    onProgress: (message: string) => void
): Promise<string> {
    const config = getCurrentApiConfig();
    
    try {
        onProgress("Initializing video generation...");

        const requestBody: any = {
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                aspectRatio: aspectRatio
            }
        };

        if (image) {
            requestBody.image = {
                imageBytes: image.base64,
                mimeType: image.mimeType
            };
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (config.type === 'official') {
            headers['x-goog-api-key'] = config.apiKey;
        } else {
            headers['Authorization'] = `Bearer ${config.apiKey}`;
        }

        const response = await fetch(`${config.baseUrl}/v1beta/models/veo-2.0-generate-001:generateVideos`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Video API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const operationData = await response.json();
        let operation = operationData;
        
        onProgress("Polling for results, this may take a few minutes...");

        // 轮询操作状态
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            const pollHeaders: Record<string, string> = {};
            
            if (config.type === 'official') {
                pollHeaders['x-goog-api-key'] = config.apiKey;
            } else {
                pollHeaders['Authorization'] = `Bearer ${config.apiKey}`;
            }

            const pollResponse = await fetch(`${config.baseUrl}/v1beta/operations/${operation.name}`, {
                headers: pollHeaders,
            });

            if (pollResponse.ok) {
                operation = await pollResponse.json();
            }
        }

        if (operation.error) {
            throw new Error(operation.error.message || "Video generation failed during operation.");
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        return config.type === 'official' ? `${downloadLink}&key=${config.apiKey}` : downloadLink;

    } catch (error) {
        console.error("Error calling Video Generation API:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
}