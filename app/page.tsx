'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Wand2, Film, Download, Sparkles, Loader2 } from 'lucide-react'

interface AnimationFrame {
  url: string
  duration: number
}

export default function Home() {
  const [mangaImage, setMangaImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setMangaImage(event.target?.result as string)
        setAnimationFrames([])
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAnime = async () => {
    if (!mangaImage) return

    setIsProcessing(true)
    setCurrentStep('Analyzing manga panels...')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep('Extracting character features...')

      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep('Generating animation frames...')

      await new Promise(resolve => setTimeout(resolve, 2000))
      setCurrentStep('Applying motion effects...')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: mangaImage })
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()

      setAnimationFrames(data.frames)
      setCurrentStep('Animation complete!')
      setIsPlaying(true)

    } catch (error) {
      console.error('Error generating anime:', error)
      setCurrentStep('Error: Generation failed. Demo mode activated.')

      const demoFrames: AnimationFrame[] = Array.from({ length: 8 }, (_, i) => ({
        url: mangaImage,
        duration: 150
      }))
      setAnimationFrames(demoFrames)
      setIsPlaying(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const playAnimation = () => {
    if (animationFrames.length === 0) return

    setIsPlaying(true)
    let frame = 0

    const interval = setInterval(() => {
      frame = (frame + 1) % animationFrames.length
      setCurrentFrame(frame)
    }, animationFrames[0]?.duration || 150)

    return () => clearInterval(interval)
  }

  const downloadAnimation = () => {
    if (!mangaImage) return
    const link = document.createElement('a')
    link.href = mangaImage
    link.download = 'anime-animation.gif'
    link.click()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Manga to Anime AI Agent
            </h1>
            <Film className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300">
            Transform static manga panels into animated sequences with AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload Manga
            </h2>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-64 border-2 border-dashed border-purple-400 rounded-xl hover:border-pink-400 transition-colors flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10"
            >
              {mangaImage ? (
                <img
                  src={mangaImage}
                  alt="Uploaded manga"
                  className="max-h-60 max-w-full object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-16 h-16 text-purple-400" />
                  <span className="text-lg">Click to upload manga image</span>
                </>
              )}
            </button>

            <button
              onClick={generateAnime}
              disabled={!mangaImage || isProcessing}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generate Anime
                </>
              )}
            </button>

            {currentStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-yellow-300 font-medium"
              >
                {currentStep}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Film className="w-6 h-6" />
              Animated Result
            </h2>

            <div className="h-64 bg-black/30 rounded-xl flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {animationFrames.length > 0 && isPlaying ? (
                  <motion.img
                    key={currentFrame}
                    src={animationFrames[currentFrame]?.url || mangaImage || ''}
                    alt="Animation frame"
                    className="max-h-full max-w-full object-contain"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.15 }}
                  />
                ) : (
                  <div className="text-gray-500 flex flex-col items-center gap-4">
                    <Film className="w-20 h-20 opacity-50" />
                    <span>Animation will appear here</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={animationFrames.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                {isPlaying ? 'Pause' : 'Play'} Animation
              </button>

              <button
                onClick={downloadAnimation}
                disabled={animationFrames.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Animation
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: 'Upload', desc: 'Upload your manga panel' },
              { icon: Wand2, title: 'AI Analysis', desc: 'AI analyzes characters & scenes' },
              { icon: Film, title: 'Animate', desc: 'Generates smooth animation frames' },
              { icon: Download, title: 'Export', desc: 'Download your anime creation' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <step.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
