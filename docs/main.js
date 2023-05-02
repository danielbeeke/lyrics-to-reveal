import Reveal from 'https://cdn.skypack.dev/reveal.js'
import { html, render } from 'https://cdn.skypack.dev/uhtml'

const urls = await fetch(`https://data.mediaworks.global/dari-worship/ebook,video?&limit=100`)
.then(response => response.json())
.then(response => response.data.flatMap(item => item.src?.filter(url => url.endsWith('.md'))).filter(Boolean))

const songs = await Promise.all(urls.map(url => fetch(url).then(async response => {
  const filename = response.url.split('/').pop().split('.')[0].replace(/-/g, ' ')
  const lyrics = await response.text()
  return { title: filename, parts: lyrics.split('\n\n') }
})))

render(document.body, html`
  <div class="reveal">
    <div class="slides">
      ${songs.flatMap(song => {
        return song.parts.map((part, index) => html`
          <section>
            <em>${song.title} (${index + 1} / ${song.parts.length})</em>
            <p>${part}</p>
          </section>
        `)
      })}
    </div>
  </div>
`)

new Reveal({ hash: true }).initialize()
