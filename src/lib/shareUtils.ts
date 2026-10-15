// ═══════════════════════════════════════════════════════════════
// BORA APP — Utilitários Estratégicos de Compartilhamento & Sanitização
// Garante UTF-8 impecável, zero caracteres bugados e alta persuasão
// ═══════════════════════════════════════════════════════════════

/**
 * Sanitiza o texto eliminando caracteres tipográficos que quebram
 * em versões web/mobile do WhatsApp (smart quotes, em-dashes, non-breaking spaces).
 */
export function cleanTextForSharing(rawText: string): string {
  if (!rawText) return '';

  return (
    rawText
      // Substitui aspas curvas por aspas normais ou marcadores de destaque
      .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      // Substitui travessões por traço simples
      .replace(/[\u2014\u2013\u2012\u2015]/g, ' - ')
      // Substitui espaços não-quebráveis por espaço comum
      .replace(/[\u00A0\u202F\u2007]/g, ' ')
      // Remove caracteres invisíveis de zero largura que quebram o parser de URL
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
      // Normaliza quebras de linha múltiplas para no máximo 2
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * Gera URL oficial universal do WhatsApp com codificação segura de URI.
 */
export function getWhatsAppShareUrl(text: string): string {
  const sanitized = cleanTextForSharing(text);
  const encoded = encodeURIComponent(sanitized);
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

/**
 * Dispara abertura segura do WhatsApp com tratamento de compatibilidade.
 */
export function openWhatsApp(text: string): void {
  if (typeof window === 'undefined') return;
  const url = getWhatsAppShareUrl(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copia texto limpo para a área de transferência com fallback para execCommand.
 */
export async function copyToClipboardClean(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const sanitized = cleanTextForSharing(text);

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(sanitized);
      return true;
    }
  } catch (err) {
    console.warn('Falha no navigator.clipboard, tentando fallback...', err);
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = sanitized;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Falha ao copiar para o clipboard:', err);
    return false;
  }
}

/**
 * Compartilha via Web Share API nativa (muito forte no mobile)
 * com fallback para WhatsApp ou cópia de link.
 */
export async function shareLinkOrText(data: {
  title: string;
  text: string;
  url: string;
}): Promise<'native' | 'whatsapp' | 'copied' | 'failed'> {
  if (typeof window === 'undefined') return 'failed';

  const sanitizedText = cleanTextForSharing(data.text);

  // 1. Tenta Web Share API nativa (ativa no Safari iOS e Chrome Android)
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: sanitizedText,
        url: data.url,
      });
      return 'native';
    } catch (err: any) {
      // Se o usuário cancelou o modal do sistema, retorna sem erro
      if (err.name === 'AbortError') return 'native';
    }
  }

  // 2. Se não houver Web Share, tenta copiar ou abrir WhatsApp
  const fullMessage = `${sanitizedText}\n\n${data.url}`;
  const copied = await copyToClipboardClean(fullMessage);
  return copied ? 'copied' : 'failed';
}
