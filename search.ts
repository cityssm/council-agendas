;(() => {
  const searchStringElement = document.querySelector(
    '#search--searchString'
  ) as HTMLInputElement

  const resultsContainerElement = document.querySelector(
    '#resultsContainer'
  ) as HTMLElement

  let agendaMetadataIsLoaded = false
  let agendaMetadata: AgendaMetadata[] = []

  function renderAgendas(): void {
    if (!agendaMetadataIsLoaded) {
      return
    }

    const searchStringPieces = searchStringElement.value
      .trim()
      .toLowerCase()
      .split(' ')

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    for (const agenda of agendaMetadata) {
      if (agenda.searchCriteria === undefined) {
        agenda.searchCriteria =
          agenda.agendaDate +
          ' ' +
          agenda.agendaTitle.toLowerCase() +
          ' ' +
          (agenda.outline ?? []).join(' ').toLowerCase()
      }

      let showAgenda = true

      for (const searchStringPiece of searchStringPieces) {
        if (!agenda.searchCriteria.includes(searchStringPiece)) {
          showAgenda = false
          break
        }
      }

      if (showAgenda) {
        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.href = agenda.url
        panelBlockElement.target = '_blank'

        panelBlockElement.innerHTML = `<div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <i class="fas fa-lg fa-file-pdf" aria-hidden="true"></i>
            </div>
            <div class="level-item">
              <h2 class="title is-6" data-field="agendaTitle"></h2>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item" data-field="agendaDate"></div>
          </div>
          </div>`

        panelBlockElement.querySelector(
          '[data-field="agendaTitle"]'
        )!.textContent = agenda.agendaTitle

        panelBlockElement.querySelector(
          '[data-field="agendaDate"]'
        )!.textContent = agenda.agendaDate

        if ((agenda.outline ?? []).length > 0) {
          panelBlockElement.insertAdjacentHTML(
            'beforeend',
            '<ul class="fa-ul"></ul>'
          )

          for (const [index, outlineItem] of agenda.outline!.entries()) {
            if (index > 10) {
              panelBlockElement.querySelector('ul')!.insertAdjacentHTML(
                'beforeend',
                `<li>
                  <span class="fa-li"><i class="fas fa-ellipsis-h" aria-hidden="true"></i></span>
                  <em>Plus More</em>
                  </li>`
              )
              break
            }
            const liElement = document.createElement('li')
            liElement.innerHTML =
              '<span class="fa-li"><i class="fas fa-bookmark" aria-hidden="true"></i></span>'

            // eslint-disable-next-line unicorn/prefer-modern-dom-apis
            liElement.insertAdjacentText('beforeend', outlineItem)

            panelBlockElement.querySelector('ul')!.append(liElement)
          }
        }

        panelElement.append(panelBlockElement)
      }
    }

    if (panelElement.hasChildNodes()) {
      resultsContainerElement.textContent = ''
      resultsContainerElement.append(panelElement)
    } else {
      resultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">
        <strong>There are no agenda documents that meet your search criteria.</strong><br />
        Note that not all agenda documents are well tagged for searching.
        </p>
        </div>`
    }
  }

  function loadMetadata(): void {
    window
      .fetch('metadata.json')
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        agendaMetadata = json
        agendaMetadataIsLoaded = true
        return agendaMetadata
      })
      .then(() => {
        renderAgendas()
        return true
      })
      .catch(() => {
        alert('Error loading agenda data')
      })
  }

  loadMetadata()

  searchStringElement.addEventListener('keyup', renderAgendas)
  document.querySelector('form')?.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault()
    renderAgendas()
  })
})()
