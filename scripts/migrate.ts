import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// WordPress JSON verilerini okumak için
const postsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../wordpress_posts.json'), 'utf-8')
)
const pagesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../wordpress_pages.json'), 'utf-8')
)
const categoriesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../wordpress_categories.json'), 'utf-8')
)

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY! // Service key gerekli (admin işlemleri için)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Reading time hesaplama
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} dk okuma`
}

// HTML içeriği temizleme
function cleanContent(html: string): string {
  // WordPress shortcode'larını temizle
  let clean = html.replace(/\[.*?\]/g, '')
  
  // Gereksiz boşlukları temizle
  clean = clean.replace(/\n\s*\n\s*\n/g, '\n\n')
  
  return clean.trim()
}

async function migrateCategories() {
  console.log('📁 Kategoriler migrate ediliyor...')
  
  const categoriesToInsert = categoriesData.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
  }))

  const { data, error } = await supabase
    .from('categories')
    .upsert(categoriesToInsert, { onConflict: 'slug' })

  if (error) {
    console.error('❌ Kategori hatası:', error)
    throw error
  }

  console.log(`✅ ${categoriesToInsert.length} kategori eklendi`)
  return data
}

async function migratePosts() {
  console.log('📝 Yazılar migrate ediliyor...')
  
  let successCount = 0
  let errorCount = 0

  for (const post of postsData) {
    try {
      const cleanedContent = cleanContent(post.content)
      const readingTime = calculateReadingTime(cleanedContent)

      const postToInsert = {
        title: post.title,
        slug: post.slug,
        content: cleanedContent,
        excerpt: post.excerpt || '',
        published_at: new Date(post.published_at).toISOString(),
        categories: post.categories || [],
        tags: post.tags || [],
        reading_time: readingTime,
        meta_description: post.excerpt?.substring(0, 160) || '',
      }

      const { error } = await supabase
        .from('posts')
        .upsert(postToInsert, { onConflict: 'slug' })

      if (error) {
        console.error(`❌ Hata (${post.title}):`, error.message)
        errorCount++
      } else {
        successCount++
        if (successCount % 10 === 0) {
          console.log(`   ${successCount} yazı eklendi...`)
        }
      }
    } catch (err) {
      console.error(`❌ Beklenmeyen hata (${post.title}):`, err)
      errorCount++
    }
  }

  console.log(`✅ ${successCount} yazı başarıyla eklendi`)
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} yazıda hata oluştu`)
  }
}

async function migratePages() {
  console.log('📄 Sayfalar migrate ediliyor...')
  
  const pagesToInsert = pagesData
    .filter((page: any) => page.slug && page.title) // Boş olanları filtrele
    .map((page: any) => ({
      title: page.title,
      slug: page.slug,
      content: cleanContent(page.content),
    }))

  const { data, error } = await supabase
    .from('pages')
    .upsert(pagesToInsert, { onConflict: 'slug' })

  if (error) {
    console.error('❌ Sayfa hatası:', error)
    throw error
  }

  console.log(`✅ ${pagesToInsert.length} sayfa eklendi`)
  return data
}

async function runMigration() {
  console.log('🚀 Migration başlıyor...\n')

  try {
    await migrateCategories()
    await migratePosts()
    await migratePages()
    
    console.log('\n✨ Migration tamamlandı!')
  } catch (error) {
    console.error('\n💥 Migration hatası:', error)
    process.exit(1)
  }
}

// Script çalıştır
runMigration()
