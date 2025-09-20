import React, { useState, useCallback, useEffect } from 'react';
import { TRANSFORMATIONS } from './constants';
import { editImage, generateVideo } from './services/geminiService';
import type { GeneratedContent, Transformation } from './types';
import TransformationSelector from './components/TransformationSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ImageEditorCanvas from './components/ImageEditorCanvas';
import { dataUrlToFile, embedWatermark, loadImage, resizeImageToMatch, downloadImage } from './utils/fileUtils';
import ImagePreviewModal from './components/ImagePreviewModal';
import MultiImageUploader from './components/MultiImageUploader';
import HistoryPanel from './components/HistoryPanel';
import { useTranslation } from './i18n/context';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import ApiSelector, { ApiConfig } from './components/ApiSelector';

type ActiveTool = 'mask' | 'none';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [transformations, setTransformations] = useState<Transformation[]>(() => {
    try {
      const savedOrder = localStorage.getItem('transformationOrder');
      if (savedOrder) {
        const orderedKeys = JSON.parse(savedOrder) as string[];
        const transformationMap = new Map(TRANSFORMATIONS.map(t => [t.key, t]));
        
        const orderedTransformations = orderedKeys
          .map(key => transformationMap.get(key))
          .filter((t): t is Transformation => !!t);

        const savedKeysSet = new Set(orderedKeys);
        const newTransformations = TRANSFORMATIONS.filter(t => !savedKeysSet.has(t.key));
        
        return [...orderedTransformations, ...newTransformations];
      }
    } catch (e) {
      console.error("Failed to load or parse transformation order from localStorage", e);
    }
    return TRANSFORMATIONS;
  });

  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [secondaryImageUrl, setSecondaryImageUrl] = useState<string | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<Transformation | null>(null);
  const [currentApiConfig, setCurrentApiConfig] = useState<ApiConfig | null>(null);
  
  useEffect(() => {
    try {
      const orderToSave = transformations.map(t => t.key);
      localStorage.setItem('transformationOrder', JSON.stringify(orderToSave));
    } catch (e) {
      console.error("Failed to save transformation order to localStorage", e);
    }
  }, [transformations]);
  
  // Cleanup blob URLs on unmount or when dependencies change
  useEffect(() => {
    return () => {
        history.forEach(item => {
            if (item.videoUrl) {
                URL.revokeObjectURL(item.videoUrl);
            }
        });
        if (generatedContent?.videoUrl) {
            URL.revokeObjectURL(generatedContent.videoUrl);
        }
    };
  }, [history, generatedContent]);


  const handleSelectTransformation = (transformation: Transformation) => {
    setSelectedTransformation(transformation);
    setGeneratedContent(null);
    setError(null);
    if (transformation.prompt !== 'CUSTOM') {
      setCustomPrompt('');
    }
  };

  const handlePrimaryImageSelect = useCallback((file: File, dataUrl: string) => {
    setPrimaryFile(file);
    setPrimaryImageUrl(dataUrl);
    setGeneratedContent(null);
    setError(null);
    setMaskDataUrl(null);
    setActiveTool('none');
  }, []);

  const handleSecondaryImageSelect = useCallback((file: File, dataUrl: string) => {
    setSecondaryFile(file);
    setSecondaryImageUrl(dataUrl);
    setGeneratedContent(null);
    setError(null);
  }, []);
  
  const handleClearPrimaryImage = () => {
    setPrimaryImageUrl(null);
    setPrimaryFile(null);
    setGeneratedContent(null);
    setError(null);
    setMaskDataUrl(null);
    setActiveTool('none');
  };
  
  const handleClearSecondaryImage = () => {
    setSecondaryImageUrl(null);
    setSecondaryFile(null);
  };

  const handleGenerateVideo = useCallback(async () => {
    if (!selectedTransformation) return;

    const promptToUse = customPrompt;
    if (!promptToUse.trim()) {
        setError(t('app.error.enterPrompt'));
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
        let imagePayload = null;
        if (primaryImageUrl) {
            const primaryMimeType = primaryImageUrl.split(';')[0].split(':')[1] ?? 'image/png';
            const primaryBase64 = primaryImageUrl.split(',')[1];
            imagePayload = { base64: primaryBase64, mimeType: primaryMimeType };
        }

        const videoDownloadUrl = await generateVideo(
            promptToUse,
            imagePayload,
            aspectRatio,
            (message) => setLoadingMessage(message) // Progress callback
        );

        setLoadingMessage(t('app.loading.videoFetching'));
        const response = await fetch(videoDownloadUrl);
        if (!response.ok) {
            throw new Error(`Failed to download video file. Status: ${response.statusText}`);
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const result: GeneratedContent = {
            imageUrl: null,
            text: null,
            videoUrl: objectUrl
        };

        setGeneratedContent(result);
        setHistory(prev => [result, ...prev]);

    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : t('app.error.unknown'));
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [selectedTransformation, customPrompt, primaryImageUrl, aspectRatio, t]);

  const handleGenerateImage = useCallback(async () => {
    if (!primaryImageUrl || !selectedTransformation) {
        setError(t('app.error.uploadAndSelect'));
        return;
    }
    if (selectedTransformation.isMultiImage && !selectedTransformation.isSecondaryOptional && !secondaryImageUrl) {
        setError(t('app.error.uploadBoth'));
        return;
    }
    
    const promptToUse = selectedTransformation.prompt === 'CUSTOM' ? customPrompt : selectedTransformation.prompt;
    if (!promptToUse.trim()) {
        setError(t('app.error.enterPrompt'));
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setLoadingMessage('');

    try {
        const primaryMimeType = primaryImageUrl!.split(';')[0].split(':')[1] ?? 'image/png';
        const primaryBase64 = primaryImageUrl!.split(',')[1];
        const maskBase64 = maskDataUrl ? maskDataUrl.split(',')[1] : null;

        if (selectedTransformation.isTwoStep) {
            setLoadingMessage(t('app.loading.step1'));
            const stepOneResult = await editImage(primaryBase64, primaryMimeType, promptToUse, null, null);

            if (!stepOneResult.imageUrl) throw new Error("Step 1 (line art) failed to generate an image.");

            setLoadingMessage(t('app.loading.step2'));
            const stepOneImageBase64 = stepOneResult.imageUrl.split(',')[1];
            const stepOneImageMimeType = stepOneResult.imageUrl.split(';')[0].split(':')[1] ?? 'image/png';

            let secondaryImagePayload = null;
            if (secondaryImageUrl) {
                const primaryImage = await loadImage(primaryImageUrl);
                const resizedSecondaryImageUrl = await resizeImageToMatch(secondaryImageUrl, primaryImage);
                const secondaryMimeType = resizedSecondaryImageUrl.split(';')[0].split(':')[1] ?? 'image/png';
                const secondaryBase64 = resizedSecondaryImageUrl.split(',')[1];
                secondaryImagePayload = { base64: secondaryBase64, mimeType: secondaryMimeType };
            }

            const stepTwoResult = await editImage(stepOneImageBase64, stepOneImageMimeType, selectedTransformation.stepTwoPrompt!, null, secondaryImagePayload);
            
            if (stepTwoResult.imageUrl) {
                stepTwoResult.imageUrl = await embedWatermark(stepTwoResult.imageUrl, "Nano Bananary");
            }

            const finalResult = { ...stepTwoResult, secondaryImageUrl: stepOneResult.imageUrl };
            setGeneratedContent(finalResult);
            setHistory(prev => [finalResult, ...prev]);

        } else {
             let secondaryImagePayload = null;
            if (selectedTransformation.isMultiImage && secondaryImageUrl) {
                const secondaryMimeType = secondaryImageUrl.split(';')[0].split(':')[1] ?? 'image/png';
                const secondaryBase64 = secondaryImageUrl.split(',')[1];
                secondaryImagePayload = { base64: secondaryBase64, mimeType: secondaryMimeType };
            }
            setLoadingMessage(t('app.loading.default'));
            const result = await editImage(primaryBase64, primaryMimeType, promptToUse, maskBase64, secondaryImagePayload);

            if (result.imageUrl) result.imageUrl = await embedWatermark(result.imageUrl, "Nano Bananary");

            setGeneratedContent(result);
            setHistory(prev => [result, ...prev]);
        }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t('app.error.unknown'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [primaryImageUrl, secondaryImageUrl, selectedTransformation, maskDataUrl, customPrompt, t]);
  
  const handleGenerate = useCallback(() => {
    if (selectedTransformation?.isVideo) {
      handleGenerateVideo();
    } else {
      handleGenerateImage();
    }
  }, [selectedTransformation, handleGenerateVideo, handleGenerateImage]);


  const handleUseImageAsInput = useCallback(async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      const newFile = await dataUrlToFile(imageUrl, `edited-${Date.now()}.png`);
      setPrimaryFile(newFile);
      setPrimaryImageUrl(imageUrl);
      setGeneratedContent(null);
      setError(null);
      setMaskDataUrl(null);
      setActiveTool('none');
      setSecondaryFile(null);
      setSecondaryImageUrl(null);
      setSelectedTransformation(null); 
      setActiveCategory(null);
    } catch (err) {
      console.error("Failed to use image as input:", err);
      setError(t('app.error.useAsInputFailed'));
    }
  }, [t]);
  
  const toggleHistoryPanel = () => setIsHistoryPanelOpen(prev => !prev);
  
  const handleUseHistoryImageAsInput = (imageUrl: string) => {
      handleUseImageAsInput(imageUrl);
      setIsHistoryPanelOpen(false);
  };
  
  const handleDownloadFromHistory = (url: string, type: string) => {
      const fileExtension = type.includes('video') ? 'mp4' : (url.split(';')[0].split('/')[1] || 'png');
      const filename = `${type}-${Date.now()}.${fileExtension}`;
      downloadImage(url, filename);
  };

  const handleBackToSelection = () => {
    setSelectedTransformation(null);
  };

  const handleResetApp = () => {
    setSelectedTransformation(null);
    setPrimaryImageUrl(null);
    setPrimaryFile(null);
    setSecondaryImageUrl(null);
    setSecondaryFile(null);
    setGeneratedContent(null);
    setError(null);
    setIsLoading(false);
    setMaskDataUrl(null);
    setCustomPrompt('');
    setActiveTool('none');
    setActiveCategory(null);
  };

  const handleOpenPreview = (url: string) => setPreviewImageUrl(url);
  const handleClosePreview = () => setPreviewImageUrl(null);
  
  const toggleMaskTool = () => {
    setActiveTool(current => (current === 'mask' ? 'none' : 'mask'));
  };
  
  const isCustomPromptEmpty = selectedTransformation?.prompt === 'CUSTOM' && !customPrompt.trim();
  
  let isGenerateDisabled = true;
  if (selectedTransformation) {
    if (selectedTransformation.isVideo) {
        isGenerateDisabled = isLoading || !customPrompt.trim();
    } else {
        let imagesReady = false;
        if (selectedTransformation.isMultiImage) {
            if (selectedTransformation.isSecondaryOptional) {
                imagesReady = !!primaryImageUrl;
            } else {
                imagesReady = !!primaryImageUrl && !!secondaryImageUrl;
            }
        } else {
            imagesReady = !!primaryImageUrl;
        }
        isGenerateDisabled = isLoading || isCustomPromptEmpty || !imagesReady;
    }
  }

  const renderInputUI = () => {
    if (!selectedTransformation) return null;

    if (selectedTransformation.isVideo) {
      return (
        <>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={t('transformations.video.promptPlaceholder')}
            rows={4}
            className="anime-input w-full mt-2"
          />
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-blue-600 mb-2">{t('transformations.video.aspectRatio')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['16:9', '9:16'] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`anime-button py-2 px-3 text-sm ${
                    aspectRatio === ratio ? 'rainbow-glow' : ''
                  }`}
                >
                  {t(ratio === '16:9' ? 'transformations.video.landscape' : 'transformations.video.portrait')}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
             <h3 className="text-sm font-semibold text-blue-600 mb-2">{t('transformations.effects.customPrompt.uploader2Title')}</h3>
            <ImageEditorCanvas
                onImageSelect={handlePrimaryImageSelect}
                initialImageUrl={primaryImageUrl}
                onMaskChange={() => {}}
                onClearImage={handleClearPrimaryImage}
                isMaskToolActive={false}
            />
          </div>
        </>
      );
    }

    if (selectedTransformation.isMultiImage) {
      return (
        <MultiImageUploader
          onPrimarySelect={handlePrimaryImageSelect}
          onSecondarySelect={handleSecondaryImageSelect}
          primaryImageUrl={primaryImageUrl}
          secondaryImageUrl={secondaryImageUrl}
          onClearPrimary={handleClearPrimaryImage}
          onClearSecondary={handleClearSecondaryImage}
          primaryTitle={selectedTransformation.primaryUploaderTitle ? t(selectedTransformation.primaryUploaderTitle) : undefined}
          primaryDescription={selectedTransformation.primaryUploaderDescription ? t(selectedTransformation.primaryUploaderDescription) : undefined}
          secondaryTitle={selectedTransformation.secondaryUploaderTitle ? t(selectedTransformation.secondaryUploaderTitle) : undefined}
          secondaryDescription={selectedTransformation.secondaryUploaderDescription ? t(selectedTransformation.secondaryUploaderDescription) : undefined}
        />
      );
    }

    return (
      <>
        <ImageEditorCanvas
          onImageSelect={handlePrimaryImageSelect}
          initialImageUrl={primaryImageUrl}
          onMaskChange={setMaskDataUrl}
          onClearImage={handleClearPrimaryImage}
          isMaskToolActive={activeTool === 'mask'}
        />
        {primaryImageUrl && (
          <div className="mt-4">
            <button
              onClick={toggleMaskTool}
              className={`anime-button w-full flex items-center justify-center gap-2 ${
                activeTool === 'mask' ? 'rainbow-glow' : ''
              }`}
            >
              <span className="anime-icon">🎨</span>
              <span>{t('imageEditor.drawMask')}</span>
            </button>
          </div>
        )}
      </>
    );
  };


  return (
    <div className="min-h-screen text-[var(--text-primary)] font-sans">
      {/* API选择器 - 放在最外层以覆盖整个页面 */}
      <ApiSelector onApiChange={setCurrentApiConfig} />
      {/* 二次元粒子背景 */}
      <div className="anime-particles">
        <div className="anime-particle" style={{left: '10%'}}></div>
        <div className="anime-particle" style={{left: '30%'}}></div>
        <div className="anime-particle" style={{left: '50%'}}></div>
        <div className="anime-particle" style={{left: '70%'}}></div>
        <div className="anime-particle" style={{left: '90%'}}></div>
      </div>

      <header className="anime-card sticky top-0 z-10 p-4 border-b-2 border-blue-200">
        <div className="container mx-auto flex justify-between items-center relative">
          <h1 
            className="anime-title text-3xl font-bold tracking-tight cursor-pointer heartbeat" 
            onClick={handleResetApp}
          >
            🍌 {t('app.title')} ✨
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="https://github.com/chocokitty66/Nano-Bananary"
              target="_blank"
              rel="noopener noreferrer"
              className="anime-button flex items-center gap-2 py-2 px-4 text-sm font-semibold hover:scale-105 transition-transform"
              title="项目地址"
            >
              <span className="anime-icon">📁</span>
              <span className="hidden sm:inline">项目</span>
            </a>
            <button
              onClick={toggleHistoryPanel}
              className="anime-button flex items-center gap-2 py-2 px-4 text-sm font-semibold"
              aria-label="Toggle generation history"
            >
              <span className="anime-icon">📚</span>
              <span className="hidden sm:inline">{t('app.history')}</span>
            </button>
            <button
              onClick={() => {/* 这里会被ApiSelector组件处理 */}}
              className="anime-button flex items-center gap-2 py-2 px-4 text-sm font-semibold"
              id="api-selector-trigger"
            >
              <span className="anime-icon">🔧</span>
              <span className="hidden sm:inline">API</span>
            </button>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main>
        {!selectedTransformation ? (
          <TransformationSelector 
            transformations={transformations} 
            onSelect={handleSelectTransformation} 
            hasPreviousResult={!!primaryImageUrl}
            onOrderChange={setTransformations}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        ) : (
          <div className="container mx-auto p-4 md:p-8 animate-fade-in">
            <div className="mb-8">
              <button
                onClick={handleBackToSelection}
                className="anime-button flex items-center gap-2 py-2 px-4"
              >
                <span className="anime-icon">🔙</span>
                {t('app.chooseAnotherEffect')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Column */}
              <div className="flex flex-col gap-6 p-6 anime-card">
                <div>
                  <div className="mb-4">
                    <h2 className="anime-title text-xl font-semibold mb-1 flex items-center gap-3">
                      <span className="text-3xl anime-icon">{selectedTransformation.emoji}</span>
                      {t(selectedTransformation.titleKey)}
                    </h2>
                    {selectedTransformation.prompt !== 'CUSTOM' ? (
                       <p className="text-blue-600">{t(selectedTransformation.descriptionKey)}</p>
                    ) : (
                      !selectedTransformation.isVideo && <p className="text-blue-600">{t(selectedTransformation.descriptionKey)}</p>
                    )}
                  </div>
                  
                  {selectedTransformation.prompt === 'CUSTOM' && !selectedTransformation.isVideo && (
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g., 'make the sky a vibrant sunset' or 'add a small red boat on the water'"
                        rows={3}
                        className="anime-input w-full -mt-2 mb-4"
                    />
                  )}
                  
                  {renderInputUI()}
                  
                   <button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled}
                    className="anime-button w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="anime-loading -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t('app.generating')}</span>
                      </>
                    ) : (
                      <>
                        <span className="anime-icon">✨</span>
                        <span>{t('app.generateImage')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Column */}
              <div className="flex flex-col p-6 anime-card">
                <h2 className="anime-title text-xl font-semibold mb-4 self-start">{t('app.result')}</h2>
                {isLoading && <div className="flex-grow flex items-center justify-center"><LoadingSpinner message={loadingMessage} /></div>}
                {error && <div className="flex-grow flex items-center justify-center w-full"><ErrorMessage message={error} /></div>}
                {!isLoading && !error && generatedContent && (
                    <ResultDisplay 
                        content={generatedContent} 
                        onUseImageAsInput={handleUseImageAsInput}
                        onImageClick={handleOpenPreview}
                        originalImageUrl={primaryImageUrl}
                    />
                )}
                {!isLoading && !error && !generatedContent && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center text-blue-400">
                    <span className="anime-icon text-6xl mb-4">🎨</span>
                    <p className="mt-2">{t('app.yourImageWillAppear')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <ImagePreviewModal imageUrl={previewImageUrl} onClose={handleClosePreview} />
      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={toggleHistoryPanel}
        history={history}
        onUseImage={handleUseHistoryImageAsInput}
        onDownload={handleDownloadFromHistory}
      />
    </div>
  );
};

// Add fade-in animation for view transitions
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  @keyframes fadeInFast {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in-fast {
    animation: fadeInFast 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default App;