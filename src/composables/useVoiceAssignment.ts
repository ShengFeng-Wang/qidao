import { computed, type Ref } from 'vue'

// 把「角色」對應到「聲音設定」。
// 策略:
// - 旁白(speaker=null)固定用第一個中文聲音、正常音高。
// - 其他角色依「出現順序」穩定分配:同一角色每次都拿到同一組設定。
// - 中文聲音不夠時,用不同音高(pitch)再變化出差異。
//
// 這樣即使只有 1~2 個中文聲音,多角色也能聽出區別(雖然免費版天花板就是這樣,
// 真正獨立音色要等接 AI TTS)。

const PITCH_VARIANTS = [1.0, 1.3, 0.8, 1.15, 0.9, 1.45] // 音高變化池

export function useVoiceAssignment(
  voices: Ref<SpeechSynthesisVoice[]>,
  speakers: Ref<string[]>, // 本章出現過的角色名(去重、依出現順序)
) {
  const chineseVoices = computed(() =>
    voices.value.filter((v) => /zh|cmn|Chinese|中文/i.test(v.lang + ' ' + v.name)),
  )

  // 角色 → { voiceURI, pitch }
  const assignment = computed(() => {
    const cn = chineseVoices.value
    const map = new Map<string, { voiceURI?: string; pitch: number }>()
    if (cn.length === 0) {
      // 沒有中文聲音:全部用預設,只靠音高區分
      speakers.value.forEach((sp, i) => {
        map.set(sp, { pitch: PITCH_VARIANTS[(i + 1) % PITCH_VARIANTS.length] })
      })
      return map
    }
    // 角色依序分配:聲音輪流、音高也輪流,組合出更多變化
    speakers.value.forEach((sp, i) => {
      const voice = cn[(i + 1) % cn.length] // +1 讓角色避開旁白用的第 0 個
      const pitch = PITCH_VARIANTS[Math.floor((i + 1) / cn.length) % PITCH_VARIANTS.length]
      map.set(sp, { voiceURI: voice.voiceURI, pitch })
    })
    return map
  })

  // 旁白設定
  const narratorVoice = computed(() => {
    const cn = chineseVoices.value
    return { voiceURI: cn[0]?.voiceURI, pitch: 1.0 }
  })

  // 給 useSpeech 用的查詢函式
  function voiceForSpeaker(speaker: string | null) {
    if (speaker == null) return narratorVoice.value
    return assignment.value.get(speaker) ?? narratorVoice.value
  }

  return { chineseVoices, assignment, voiceForSpeaker }
}
