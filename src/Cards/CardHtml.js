import d3 from "../d3.js"
import f3 from "../index.js"
import {processCardDisplay} from "./utils.js"
import {pathToMain} from "../CalculateTree/createLinks.js"

CardHtmlWrapper.is_html = true
export default function CardHtmlWrapper(...args) { return new CardHtml(...args) }

CardHtml.prototype.is_html = true
function CardHtml(cont, store) {
  this.cont = cont
  this.store = store
  this.getCard = null
  this.card_display = [d => `${d.data["first name"]} ${d.data["last name"]}`]
  this.onCardClick = this.onCardClickDefault
  this.style = 'default'
  this.mini_tree = false
  this.onCardUpdate = null
  this.card_dim = {}

  this.init()

  return this
}

CardHtml.prototype.init = function() {
  this.svg = this.cont.querySelector('svg.main_svg')

  this.getCard = () => f3.elements.CardHtml({
    store: this.store,
    card_display: this.card_display,
    onCardClick: this.onCardClick,
    style: this.style,
    mini_tree: this.mini_tree,
    onCardUpdate: this.onCardUpdate,
    card_dim: this.card_dim,
    onCardMouseenter: this.onCardMouseenter ? this.onCardMouseenter.bind(this) : null,
    onCardMouseleave: this.onCardMouseleave ? this.onCardMouseleave.bind(this) : null
  })
}

CardHtml.prototype.setCardDisplay = function(card_display) {
  this.card_display = processCardDisplay(card_display)

  return this
}

CardHtml.prototype.setOnCardClick = function(onCardClick) {
  this.onCardClick = onCardClick
  return this
}

CardHtml.prototype.onCardClickDefault = function(e, d) {
  this.store.updateMainId(d.data.id)
  this.store.updateTree({})
}

CardHtml.prototype.setStyle = function(style) {
  this.style = style
  return this
}

CardHtml.prototype.setMiniTree = function(mini_tree) {
  this.mini_tree = mini_tree

  return this
}

CardHtml.prototype.setOnCardUpdate = function(onCardUpdate) {
  this.onCardUpdate = onCardUpdate
  return this
}

CardHtml.prototype.setCardDim = function(card_dim) {
  if (typeof card_dim !== 'object') {
    console.error('card_dim must be an object')
    return this
  }
  for (let key in card_dim) {
    const val = card_dim[key]
    if (typeof val !== 'number' && typeof val !== 'boolean') {
      console.error(`card_dim.${key} must be a number or boolean`)
      return this
    }
    if (key === 'width') key = 'w'
    if (key === 'height') key = 'h'
    if (key === 'img_width') key = 'img_w'
    if (key === 'img_height') key = 'img_h'
    if (key === 'img_x') key = 'img_x'
    if (key === 'img_y') key = 'img_y'
    this.card_dim[key] = val
  }

  return this
}

CardHtml.prototype.setOnHoverPathToMain = function() {
  this.onCardMouseenter = this.onEnterPathToMain.bind(this)
  this.onCardMouseleave = this.onLeavePathToMain.bind(this)
  return this
}

CardHtml.prototype.unsetOnHoverPathToMain = function() {
  this.onCardMouseenter = null
  this.onCardMouseleave = null
  return this
}

CardHtml.prototype.onEnterPathToMain = function(e, datum) {
  const main_datum = this.store.getMainDatum()
  const links = d3.select(this.cont).select('svg.main_svg .links_view').selectAll('.link')
  const links_to_main = pathToMain(links, datum, main_datum)
  links_to_main.forEach(d => d3.select(d.node).transition().duration(100).attr('stroke-width', 4))

  return this
}

CardHtml.prototype.onLeavePathToMain = function(e, d) {
  d3.select(this.cont).select('svg.main_svg .links_view').selectAll('.link').transition().duration(500).attr('stroke-width', 1)

  return this
}
