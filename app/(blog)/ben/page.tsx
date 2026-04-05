import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ben - tr.dincer',
  description: 'Hakkımda',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article className="prose prose-lg max-w-none">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Merhaba,
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed">
          Burada ilgi duyduğum şeyler hakkında yazıyorum.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          Bana ulaşmak için{' '}
          <a href="mailto:hello@dincer.co" className="font-semibold text-blue-600 hover:text-blue-800">
            hello@dincer.co
          </a>{' '}
          üzerinden iletişime geçebilirsiniz.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          Ya da aşağıdaki kişisel ve iş hesaplarımı kullanabilirsiniz.
        </p>

        <h2 className="font-serif text-3xl font-semibold text-gray-900 mt-12 mb-6">
          Kişisel
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-2">Instagram:</p>
            <ul className="list-none space-y-1">
              <li>
                <a
                  href="https://www.instagram.com/dincer.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  dincer.co
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/dincerbasdemir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  dincerbasdemir
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-gray-600 mb-2">YouTube:</p>
            <a
              href="https://www.youtube.com/@dincerbasdemir/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              dincerbasdemir
            </a>
          </div>
        </div>

        <h2 className="font-serif text-3xl font-semibold text-gray-900 mt-12 mb-6">
          İş
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-2">Web:</p>
            <ul className="list-none space-y-1">
              <li>
                <a
                  href="https://dijitalortam.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  dijitalortam.net
                </a>
              </li>
              <li>
                <a
                  href="https://argevitas.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  argevitas.com
                </a>
              </li>
              <li>
                <a
                  href="https://ai.dincer.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ai.dincer.co
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-gray-600 mb-2">Email:</p>
            <ul className="list-none space-y-1">
              <li>
                <a href="mailto:info@dijitalortam.net" className="text-blue-600 hover:text-blue-800 font-medium">
                  info@dijitalortam.net
                </a>
              </li>
              <li>
                <a href="mailto:info@argevitas.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  info@argevitas.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-gray-600 mb-2">Instagram:</p>
            <ul className="list-none space-y-1">
              <li>
                <a
                  href="https://www.instagram.com/dijital.ortam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  dijitalortam
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/argevitasdijital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  argevitasdijital
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-gray-600 mb-2">YouTube:</p>
            <a
              href="https://www.youtube.com/@dijitalortam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              dijitalortam
            </a>
          </div>

          <div>
            <p className="text-gray-600 mb-2">Facebook:</p>
            <a
              href="https://www.facebook.com/dijitalortam1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              dijitalortam1
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}
