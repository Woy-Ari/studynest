/* ============================================
   QUOTES.JS - StudyNest
   Motivational Quotes Database
   ============================================ */

/**
 * Quotes Manager
 * Database kata-kata motivasi untuk menginspirasi pengguna
 */

class QuotesManager {
  constructor() {
    this.quotes = this.initializeQuotes();
    this.currentIndex = 0;
  }

  /**
   * Initialize quotes database
   */
  initializeQuotes() {
    return [
      {
        id: 1,
        text: 'Kesuksesan adalah hasil dari persiapan, kerja keras, dan mempelajari kegagalan.',
        author: 'Colin Powell',
        category: 'motivasi',
        emoji: '🚀'
      },
      {
        id: 2,
        text: 'Jangan menunggu kesempatan sempurna, ciptakan sendiri.',
        author: 'George Bernard Shaw',
        category: 'tindakan',
        emoji: '⚡'
      },
      {
        id: 3,
        text: 'Belajar adalah pelajaran terbaik yang bisa kamu berikan kepada dirimu sendiri.',
        author: 'Unknown',
        category: 'belajar',
        emoji: '📚'
      },
      {
        id: 4,
        text: 'Kegagalan adalah langkah menuju kesuksesan.',
        author: 'Thomas Edison',
        category: 'ketahanan',
        emoji: '💪'
      },
      {
        id: 5,
        text: 'Dedikasi dan kerja keras adalah kunci kesuksesan.',
        author: 'Unknown',
        category: 'kerja keras',
        emoji: '🎯'
      },
      {
        id: 6,
        text: 'Mulai dari sekarang, jangan dari besok.',
        author: 'Unknown',
        category: 'tindakan',
        emoji: '⏰'
      },
      {
        id: 7,
        text: 'Otak adalah harta yang paling berharga, peliharalah dengan belajar.',
        author: 'Unknown',
        category: 'belajar',
        emoji: '🧠'
      },
      {
        id: 8,
        text: 'Jangan pernah menyerah pada impianmu.',
        author: 'Unknown',
        category: 'motivasi',
        emoji: '✨'
      },
      {
        id: 9,
        text: 'Setiap hari adalah kesempatan baru untuk belajar dan berkembang.',
        author: 'Unknown',
        category: 'belajar',
        emoji: '🌅'
      },
      {
        id: 10,
        text: 'Konsistensi adalah kunci kesuksesan jangka panjang.',
        author: 'Unknown',
        category: 'motivasi',
        emoji: '🔑'
      },
      {
        id: 11,
        text: 'Jangan takut gagal, takut tidak mencoba.',
        author: 'Unknown',
        category: 'keberanian',
        emoji: '🦁'
      },
      {
        id: 12,
        text: 'Pengetahuan adalah kekuatan yang tidak bisa diambil dari siapa pun.',
        author: 'Napoleon Bonaparte',
        category: 'belajar',
        emoji: '💡'
      },
      {
        id: 13,
        text: 'Mimpi besar dimulai dengan langkah kecil.',
        author: 'Unknown',
        category: 'motivasi',
        emoji: '🌟'
      },
      {
        id: 14,
        text: 'Fokus pada apa yang bisa kamu kontrol, jangan khawatir yang lain.',
        author: 'Unknown',
        category: 'mindfulness',
        emoji: '🎯'
      },
      {
        id: 15,
        text: 'Setiap master dulu pernah menjadi pemula.',
        author: 'Unknown',
        category: 'pembelajaran',
        emoji: '🌱'
      },
      {
        id: 16,
        text: 'Waktu adalah investasi terbaik, gunakan dengan bijak untuk belajar.',
        author: 'Unknown',
        category: 'waktu',
        emoji: '⏳'
      },
      {
        id: 17,
        text: 'Kesalahan adalah guru terbaik, serap pelajarannya dan lanjut maju.',
        author: 'Unknown',
        category: 'pembelajaran',
        emoji: '📖'
      },
      {
        id: 18,
        text: 'Kepercayaan diri datang dari persiapan yang matang.',
        author: 'Unknown',
        category: 'persiapan',
        emoji: '💎'
      },
      {
        id: 19,
        text: 'Jangan bandingkan dirimu dengan orang lain. Bandingkan dengan dirimu kemarin.',
        author: 'Unknown',
        category: 'mindset',
        emoji: '🪞'
      },
      {
        id: 20,
        text: 'Masa depan milik mereka yang percaya pada keindahan mimpi mereka.',
        author: 'Eleanor Roosevelt',
        category: 'motivasi',
        emoji: '🌈'
      },
      {
        id: 21,
        text: 'Satu-satunya cara untuk berbuat pekerjaan besar adalah mencintai apa yang kamu lakukan.',
        author: 'Steve Jobs',
        category: 'passion',
        emoji: '❤️'
      },
      {
        id: 22,
        text: 'Disiplin adalah jembatan antara tujuan dan pencapaian.',
        author: 'Unknown',
        category: 'disiplin',
        emoji: '🌉'
      },
      {
        id: 23,
        text: 'Nilai dirimu bukan dari nilai raport, tapi dari usaha yang kamu berikan.',
        author: 'Unknown',
        category: 'harga diri',
        emoji: '👑'
      },
      {
        id: 24,
        text: 'Belajar hari ini adalah mengubah masa depan besok.',
        author: 'Unknown',
        category: 'belajar',
        emoji: '📝'
      },
      {
        id: 25,
        text: 'Kesuksesan bukan tentang keberuntungan, tapi tentang keputusan yang tepat.',
        author: 'Unknown',
        category: 'keputusan',
        emoji: '✅'
      },
      {
        id: 26,
        text: 'Tetap tenang, fokus, dan percaya pada proses.',
        author: 'Unknown',
        category: 'mindfulness',
        emoji: '🧘'
      },
      {
        id: 27,
        text: 'Setiap pertanyaan yang kamu tanya adalah tanda kamu ingin belajar lebih.',
        author: 'Unknown',
        category: 'pembelajaran',
        emoji: '❓'
      },
      {
        id: 28,
        text: 'Jangan cari alasan, cari solusi.',
        author: 'Unknown',
        category: 'problem solving',
        emoji: '🔧'
      },
      {
        id: 29,
        text: 'Kerja cerdas lebih penting dari kerja keras tanpa arah.',
        author: 'Unknown',
        category: 'strategi',
        emoji: '🧩'
      },
      {
        id: 30,
        text: 'Hari ini yang membuat perbedaan adalah keputusan yang kamu ambil sekarang.',
        author: 'Unknown',
        category: 'tindakan',
        emoji: '🎬'
      }
    ];
  }

  /**
   * Get random quote
   */
  getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  /**
   * Get quote by ID
   */
  getQuoteById(id) {
    return this.quotes.find(q => q.id === id);
  }

  /**
   * Get quotes by category
   */
  getQuotesByCategory(category) {
    return this.quotes.filter(q => q.category === category);
  }

  /**
   * Get all categories
   */
  getCategories() {
    const categories = new Set(this.quotes.map(q => q.category));
    return Array.from(categories);
  }

  /**
   * Get quote of the day
   */
  getQuoteOfTheDay() {
    const today = new Date().toDateString();
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % this.quotes.length;
    return this.quotes[index];
  }

  /**
   * Get next quote in rotation
   */
  getNextQuote() {
    this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    return this.quotes[this.currentIndex];
  }

  /**
   * Search quotes
   */
  searchQuotes(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return this.quotes.filter(q => 
      q.text.toLowerCase().includes(lowerKeyword) ||
      q.author.toLowerCase().includes(lowerKeyword) ||
      q.category.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Get quote count
   */
  getQuoteCount() {
    return this.quotes.length;
  }

  /**
   * Display quote in HTML element
   */
  displayQuote(elementId, quote) {
    const element = document.getElementById(elementId);
    if (element && quote) {
      element.innerHTML = `
        <div class="quote-content">
          <div class="quote-emoji">${quote.emoji}</div>
          <p class="quote-text">"${quote.text}"</p>
          <p class="quote-author">— ${quote.author}</p>
          <span class="quote-category">${quote.category}</span>
        </div>
      `;
    }
  }

  /**
   * Display random quote
   */
  displayRandomQuote(elementId) {
    const quote = this.getRandomQuote();
    this.displayQuote(elementId, quote);
  }

  /**
   * Display quote of the day
   */
  displayQuoteOfTheDay(elementId) {
    const quote = this.getQuoteOfTheDay();
    this.displayQuote(elementId, quote);
  }
}

// Create global instance
const quotes = new QuotesManager();

// Auto-initialize quote display on page load
document.addEventListener('DOMContentLoaded', () => {
  const quoteElement = document.getElementById('quote-display');
  if (quoteElement) {
    quotes.displayQuoteOfTheDay('quote-display');
  }

  // Setup quote refresh button
  const refreshQuoteBtn = document.getElementById('refresh-quote');
  if (refreshQuoteBtn) {
    refreshQuoteBtn.addEventListener('click', () => {
      quotes.displayRandomQuote('quote-display');
    });
  }
});
