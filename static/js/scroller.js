function Scroller (element) {
  var _this = this
  this._container = element
  this._items = element.children
  this.selectedItem = 0
  this._buttons = {}

  this._element = document.createElement('div')
  this._element.classList.add('tabs-scroller-items')

  this._container.classList.add('tabs-scroller')
  while (element.children.length) {
    this._element.appendChild(element.children[0])
  }
  this._container.appendChild(this._element)
  this._items = this._element.children

  this._buttons.left = document.createElement('button')
  this._buttons.left.classList.add('left-scroller-button')
  this._buttons.left.onclick = function (e) {
    // Navigate left
    console.info('Navigate left')
    _this.scrollToIndex(null, -1)
  }

  this._buttons.right = document.createElement('button')
  this._buttons.right.classList.add('right-scroller-button')
  this._buttons.right.onclick = function (e) {
    // Navigate left
    console.info('Navigate right')
    _this.scrollToIndex(null, 1)
  }

  this._container.appendChild(this._buttons.left)
  this._container.appendChild(this._buttons.right)
  this.calculate()
}

Scroller.prototype.calculate = function () {
  var scrollWidth = this._element.scrollWidth
  var elementWidth = this._element.offsetWidth
  this._overflow = (scrollWidth > elementWidth)
  this._element.style.width = elementWidth
  this.scrollToIndex()
  this.redrawArrows()
}

Scroller.prototype.scrollToIndex = function (index, relative) {
  index = index || this.selectedItem + (relative || 0)
  index = Math.max(index, 0)
  index = Math.min(index, this._items.length - 1)
  this.selectedItem = index

  var scrollOffset = this._items[this.selectedItem].offsetLeft
  var windowSize = this._container.offsetWidth
  var scrollWidth = this._element.scrollWidth
  if ((scrollOffset + windowSize) >= scrollWidth) {
    // Scroll all the way to the right to show the last element
    // this._element.scrollLeft = this._element.scrollWidth
    this._element.style.transform = 'translate3d(-' + (scrollWidth - windowSize) + 'px, 0, 0)'
  } else {
    // this._element.scrollLeft = this._items[index].offsetLeft
    this._element.style.transform = 'translate3d(-' + scrollOffset + 'px, 0, 0)'
  }
  this.redrawArrows()
}

Scroller.prototype.redrawArrows = function () {
  var scrollOffset = this._items[this.selectedItem].offsetLeft
  var windowSize = this._container.offsetWidth
  var scrollWidth = this._element.scrollWidth
  if (scrollOffset === 0) {
    this._buttons.left.classList.add('hidden-button')
  } else {
    this._buttons.left.classList.remove('hidden-button')
  }
  if ((scrollOffset + windowSize) >= scrollWidth) {
    this._buttons.right.classList.add('hidden-button')
  } else {
    this._buttons.right.classList.remove('hidden-button')
  }
}

Scroller.prototype.constructor = Scroller
