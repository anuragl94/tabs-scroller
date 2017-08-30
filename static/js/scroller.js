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
    // Find the previous partially visible/invisible element and scroll window
    // so that it is the last element visible
    var prevWindowElements = Array.prototype.filter.call(_this._items, function (item) {
      return ((item.offsetLeft) >= (_this.scrollOffset - _this.windowSize))
    })
    var index = Array.prototype.indexOf.call(_this._items, prevWindowElements[0])
    _this.scrollToIndex(index)
  }

  this._buttons.right = document.createElement('button')
  this._buttons.right.classList.add('right-scroller-button')
  this._buttons.right.onclick = function (e) {
    // Navigate right
    // Find the next partially visible/invisible element and scroll to that
    var invisibleElements = Array.prototype.filter.call(_this._items, function (item) {
      return (
        (item.offsetLeft >= _this.scrollOffset) &&
        ((item.offsetLeft + item.offsetWidth) > (_this.scrollOffset + _this.windowSize))
      )
    })
    var index = Array.prototype.indexOf.call(_this._items, invisibleElements[0])
    _this.scrollToIndex(index)
  }

  this._container.appendChild(this._buttons.left)
  this._container.appendChild(this._buttons.right)
  this.calculate()
}

Scroller.prototype.calculate = function () {
  var scrollWidth = Array.prototype.map.call(this._items, function (item) {
    return item.offsetWidth
  }).reduce(function (a, b) {
    return a + b
  })
  var windowSize = this._container.offsetWidth
  this._overflow = (scrollWidth > windowSize)
  this._element.style.width = windowSize
  this.scrollWidth = scrollWidth
  this.windowSize = windowSize
  this.scrollToIndex()
  this.redrawArrows()
}

Scroller.prototype.scrollToIndex = function (index, relative) {
  index = ((typeof index === 'number') ? index : this.selectedItem) + (relative || 0)
  index = Math.max(index, 0)
  index = Math.min(index, this._items.length - 1)
  this.selectedItem = index

  var scrollOffset = this._items[this.selectedItem].offsetLeft
  if ((scrollOffset + this.windowSize) >= this.scrollWidth) {
    // Scroll all the way to the right to show the last element
    this.scrollOffset = this.scrollWidth - this.windowSize
  } else {
    this.scrollOffset = scrollOffset
  }
  this._element.style.transform = 'translate3d(-' + this.scrollOffset + 'px, 0, 0)'
  this.redrawArrows()
}

Scroller.prototype.redrawArrows = function () {
  var scrollOffset = this._items[this.selectedItem].offsetLeft
  var windowSize = this._container.offsetWidth
  var scrollWidth = this.scrollWidth
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
