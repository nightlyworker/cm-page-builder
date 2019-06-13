import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames';
import { PermissionContext } from '../contexts/permission-context';
import sanitizeHtml from 'sanitize-html'

export default class ContentEditable extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      showMoreOptions: false
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (nextProps.html !== (this.elem && this.elem.innerHTML) )
  }

  handleKeyPress = (e, handleAction, changeComponent) => {
    switch(e.key){
      case 'Enter':
        e.preventDefault()
        e.target.blur()
        setTimeout(() => {
          if (this.props.orderedList || this.props.unorderedList) {
            if (!this.elem && !this.elem.innerHTML)
              changeComponent(e, 'Text', this.props.id)
            else
              handleAction(this.props.orderedList ? 'olist' : 'ulist', this.props.id, this.elem)
          }
          else
            handleAction('add-component', this.props.id, this.elem)
        })
        break
      default:
    }
  }

  handleKeyDown = (e, handleAction) => {
    // if(e.key === 'Backspace'){
    //   if(!this.elem.innerHTML){
    //     let prevChild = null
    //     if(this.elem.parentNode.previousSibling){
    //       if(this.elem.parentNode.previousSibling.nodeName === 'SPAN'){
    //         prevChild = this.elem.parentNode.parentNode.previousSibling.childNodes[1].childNodes[1]
    //       }else{
    //         prevChild = this.elem.parentNode.previousSibling.firstChild[1]
    //       }
    //     }else{
    //       prevChild = this.elem.parentNode.parentNode.previousSibling.firstChild.firstChild[1]
    //     }
    //     prevChild.focus()
    //     handleAction('remove-component', this.props.id, this.elem)
    //   }
    // }
  }

  emitChange = (e) => {
    if(this.props.orderedList){
      e.target.parentElement.parentElement.firstElementChild.classList.remove("list-span-focus")
    }
    var html = this.elem.innerHTML
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange({
        target: {
          value: html
        }
      });
    }
    this.lastHtml = html;
  }

  onInputChange = (e) => {
    var html = this.elem.innerHTML
    if (this.props.onInputChange) {
      this.props.onInputChange(html);
      // this.emitChange(e)
    }
  }

  optionHandleClick = (e, handleAction) => {
    e.stopPropagation()
    e.preventDefault()
    handleAction('remove-component', this.props.id)
    // this.setState({showMoreOptions: true})
  }

  handleFocus = (e) => {
    if(this.props.orderedList){
      e.target.parentElement.parentElement.firstElementChild.className = "list-span-focus"
    }
  }
  
  render() {
    const { placeholder, className, styles, handleMouseUp, listOrder, html } = this.props
    const {showMoreOptions} = this.state
    return(
      <PermissionContext.Consumer>
        {
          (value) => 
            <div className="component-section">
              {listOrder}
              {
                className !== 'cm-title' && value.status === 'Edit' &&
                <div className="component-dragger" onClick={(e) => this.optionHandleClick(e, value.handleAction)}><i className="cm cm-handle" />
                  {
                    showMoreOptions &&
                    <div onMouseUp={(e) => e.stopPropagation()}>test</div>
                  }
                </div>
              }
              <div
                data-id={this.props.id}
                ref={node => this.elem = node}
                className={classNames(className, value.status.toLowerCase())}
                onInput={this.onInputChange}
                onBlur={this.emitChange}
                onFocus={this.handleFocus}
                contentEditable={value.status === 'Edit'}
                placeholder={html || value.status === 'Edit' ? placeholder : ''}
                dangerouslySetInnerHTML={{__html: sanitizeHtml(html || '')}}
                styles={styles}
                onKeyPress={(e) => this.handleKeyPress(e, value.handleAction, value.editComponent)}
                onKeyDown={(e) => this.handleKeyDown(e, value.handleAction)}
                onMouseUp={handleMouseUp}
              />
          </div>
        }
      </PermissionContext.Consumer>
    )
  }
}