import EasySpeech from 'easy-speech'
import { useEffect, useReducer, useRef } from 'react'
import { doPrint } from '~/clientOnly/misc.client'
import { convertToSpeakableText } from '~/clientOnly/speech.client'
import MixerHorizontalIconSVG from '~/resources/icons/MixerHorizontalIconSVG'
import PauseIconSVG from '~/resources/icons/PauseIconSVG'
import PlayIconSVG from '~/resources/icons/PlayIconSVG'
import PrintIconSVG from '~/resources/icons/PrintIconSVG'
import SpeakerIconSVG from '~/resources/icons/SpeakerIconSVG'


type StateActions = {
    prop: string
    value: number | boolean | SpeechSynthesisVoice | null
}

type SpeakAndPrintInitStates = {
    isReady: boolean,
    isPaused: boolean,
    isPlaying: boolean,
    voice: null | SpeechSynthesisVoice,
    pitch: number,
    volume: number,
    rate: number,
    optionsOpen: boolean
}

const speakAndPrintInitStates: SpeakAndPrintInitStates = {
    isReady: false,
    isPaused: false,
    isPlaying: false,
    voice: null,
    pitch: 1,
    volume: 1,
    rate: 1,
    optionsOpen: false
}

const speakAndPrintReducer = (state: SpeakAndPrintInitStates, action: StateActions) => {
    const { prop, value } = action
    return { ...state, [prop]: value }
}


/**
 *  markup and logic for print and voice of articles
 */
export default function SpeakAndPrint({ texts }: { texts: string }) {
    const speakerRef = useRef(EasySpeech)
    const voicesRef = useRef<SpeechSynthesisVoice[] | null>(null)
    const [state, setter] = useReducer(speakAndPrintReducer, speakAndPrintInitStates)


    const cancelSpeaker = async () => {
        try {
            if (speakerRef?.current?.status()?.initialized === true) {
                await speakerRef?.current?.cancel()
            }
        } catch {
            speakerRef.current = null
        }
    }


    const pauseSpeaker = async () => {
        if (speakerRef.current?.status()?.initialized === true && state.isPlaying) {
            await speakerRef.current.pause()
            setter({ prop: 'isPaused', value: true })
        }
    }


    const resumeSpeaker = async () => {
        if (speakerRef.current?.status()?.initialized === true && state.isPlaying) {
            await speakerRef.current.resume()
            setter({ prop: 'isPaused', value: false })
        }
    }


    const initSpeaker = async () => {
        if (typeof window !== 'object') return
        const init = await speakerRef?.current?.init()
        if (init) {
            const voicesFiltered: SpeechSynthesisVoice[] = speakerRef.current.filterVoices({ language: 'de' })
            if (voicesFiltered.length) setter({ prop: 'isReady', value: init })
            const defaultVoice = voicesFiltered.filter((it) => it.default === true)
            if (defaultVoice.length) setter({ prop: 'voice', value: defaultVoice[0] }) // setVoice(defaultVoice[0])
            voicesRef.current = voicesFiltered
        } else if (speakerRef?.current?.status()?.initialized === true) {
            setter({ prop: 'isReady', value: true })
        }
    }


    const startSpeaker = async (text: string) => {
        setter({ prop: 'isPlaying', value: true })
        await speakerRef.current.speak({
            voice: state.voice,
            text,
            pitch: state.pitch,
            rate: state.rate,
            volume: state.volume,
        })
    }


    useEffect(() => {
        initSpeaker()
        return () => { cancelSpeaker() }
    }, [])


    return (
        <div className='speaker_frame'>
            <div className='speaker_inner'>

                <button className='btn2' type='button' onClick={() => doPrint()}>
                    <PrintIconSVG width={24} height={24} aria-label="Drucken" />
                </button>

                {state.isReady ? (
                    <>
                        {state.isPlaying ? (
                            <>
                                {state.isPaused ? (<button className='btn2' type='button' onClick={() => resumeSpeaker()}>
                                    <PlayIconSVG width={24} height={24} aria-label="Fortfahren" />
                                </button>) : (
                                    <button className='btn2' type='button' onClick={() => pauseSpeaker()}>
                                        <PauseIconSVG width={24} height={24} aria-label="Pause" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button className='btn2' type='button' onClick={() => startSpeaker(convertToSpeakableText(texts))}>
                                <SpeakerIconSVG width={24} height={24} aria-label="Vorlesen" />
                            </button>
                        )}

                        {!state.isPlaying ? (
                            <button className='btn2' type='button' onClick={() => setter({ prop: 'optionsOpen', value: !state.optionsOpen })} >
                                <MixerHorizontalIconSVG width={24} height={24} aria-label="Speaker Einstellungen" />
                            </button>
                        ) : null}

                        {!state.isPlaying && state.optionsOpen ? (
                            <div className='speaker_options'>
                                <strong>
                                    Vorlese Einstellungen
                                </strong>

                                <div>
                                    <label htmlFor='volume'>
                                        Lautstärke
                                    </label>
                                    <input defaultValue={state.volume} id='volume' type='range' max={1} min={0} step={0.1} onChange={(e) => setter({ prop: 'volume', value: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label htmlFor='speed'>
                                        Geschwindigkeit
                                    </label>
                                    <input defaultValue={state.rate} type='range' id='speed' min={0.1} max={2} step={0.1} onChange={(e) => setter({ prop: 'rate', value: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label htmlFor='pitch'>
                                        Tonlage
                                    </label>
                                    <input defaultValue={state.pitch} type='range' id='pitch' min={0} max={2} step={0.1} onChange={(e) => setter({ prop: 'pitch', value: parseFloat(e.target.value) })} />
                                </div>

                                <div>
                                    <label htmlFor='voice'>Stimme</label>

                                    <select id='voice' className='btn1'>
                                        {voicesRef.current?.map((it) => (
                                            <option className='btn1' key={it.voiceURI}>{it.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : null}

                    </>
                ) : null}


            </div>
        </div>
    )
}