import Reveal from 'https://cdn.skypack.dev/reveal.js'
import { html, render } from 'https://cdn.skypack.dev/uhtml'

let urls = [
  'https://raw.githubusercontent.com/danielbeeke/liturgie-definitief/master/slides/lyrics/breng-ons-samen.md',
  'https://raw.githubusercontent.com/danielbeeke/liturgie-definitief/master/slides/lyrics/laat-het-huis-gevuld-zijn.md'
]

let songs = []

const draw = () => {

  if (songs.length === 0) {
    render(document.body, html`
      <form onSubmit=${async (event) => {
        event.preventDefault()
        
        songs = await Promise.all(urls.map(url => fetch(url).then(async response => {
          const filename = response.url.split('/').pop().split('.')[0].replace(/-/g, ' ')
          const lyrics = await response.text()
          return {
            title: filename,
            parts: lyrics.split('\n\n'), 
          }
        })))

        draw()
      }}>

        <textarea onChange=${(event) => urls = event.target.value.split('\n').map(line => line.trim())}>${urls.join('\n')}</textarea>
        <button>Open presentation</button>
      </form>
    `)
  }
  else {
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
  }

}


draw()