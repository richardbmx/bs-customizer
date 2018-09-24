import $ from 'jquery'
import 'bootstrap/js/dist/modal'

let $modal
let $loader
let $generatedLink
let $loadingStatus
let $modalHeader

const createModal = () => {
  $modal = $('.dialog-loader')
  $loader = $('#loader')
  $generatedLink = $('#generatedLink')
  $loadingStatus = $('#loadingStatus')
  $modalHeader = $modal.find('.modal-header')

  $modal.on('hidden.bs.modal', () => {
    updateDialogStatus('')

    $modalHeader.addClass('d-none')
    URL.revokeObjectURL($generatedLink.attr('href'))
    $generatedLink.addClass('d-none')
      .attr('href', '')

    $loader.removeClass('d-none')
    $loadingStatus.removeClass('d-none')
  })
}

const showModal = (callback) => {
  $loadingStatus.text('Downloading your assets...')
  $modal
    .one('shown.bs.modal', () => {
      callback()
    })
    .modal('show')
}

const updateDialogStatus = (text) => {
  $loadingStatus.text(text)
  return $loadingStatus[0].offsetHeight
}

const updateLink = (fileName, link) => {
  $generatedLink.attr('href', link)
    .attr('download', fileName)
    .removeClass('d-none')

  $modalHeader.removeClass('d-none')
  $loader.addClass('d-none')
  $loadingStatus.addClass('d-none')
}

const hideModal = () => {
  $modal.modal('hide')
}

export {
  createModal,
  showModal,
  hideModal,
  updateDialogStatus,
  updateLink,
}
