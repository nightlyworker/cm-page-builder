import React from 'react'
import { CSSTransition } from 'react-transition-group'
import '../styles/components/AddComponent.css'
import { connect } from 'react-redux';
import {
  addNewComponent,
  updateComponent,
  removeComponent
} from '../redux/reducers/appDataReducers'
import {
  setCurrentElem
} from '../redux/reducers/currentElemReducer'
import { TEXT_INPUT_COMPONENT } from '../utils/constant';

class AddComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showActionBtn: true,
    }
  }

  componentDidMount(){
    this.checkAndFocus(this.props)
  }
  
  componentDidUpdate(){
    this.checkAndFocus(this.props)
  }

  checkAndFocus = (props) => {
    let {currentElem, id} = props
    if(currentElem.elemId && id === currentElem.elemId){
      let elem = document.querySelector(`[data-block-id="${id}"] [data-root="true"]`)
      if(elem !== document.activeElement){
        elem.focus()
      }
    }
  } 

  handleInput = (data) => {
    this.setState({showActionBtn: !data})
  }

  handleClick = (e) => {
    if(this.elem.querySelector(`[data-block-type="component-select-div"]`).contains(e.target)){
      let currentTarget = e.currentTarget
      let target = e.target.nodeName === 'I' ? e.target.parentNode : e.target
      this.props.updateComponent({currentTarget, target, action: 'updateComponentType'})
    }
  }


  handleKeyDown = (e) => {
    let {appData, currentElem} = this.props 
    let currentElemPos
    switch (e.key) {
      case 'Enter':
        if(!e.shiftKey){
          e.preventDefault()
          this.props.addNewComponent({id: e.currentTarget.dataset.blockId})
          break;
        }
      case 'Backspace':
        if(this.elem.querySelector(`[data-root="true"]`).innerHTML === ''){
          let newCurrentId = null
          for(let i in appData.componentData){
            if(appData.componentData[+i+1] && (appData.componentData[+i+1].id === currentElem.elemId)){
              newCurrentId = appData.componentData[i].id
            }
          }
          this.props.removeComponent({blockId: currentElem.elemId})
          this.props.setCurrentElem(newCurrentId)
        }
        break
      case 'ArrowUp':
        currentElemPos = appData.componentData.findIndex(data => data.id === currentElem.elemId)
        while(currentElemPos > 0){
          if(TEXT_INPUT_COMPONENT.includes(appData.componentData[currentElemPos-1].componentType)){
            this.props.setCurrentElem(appData.componentData[currentElemPos-1].id)
            break
          }
          currentElemPos--
        }
        break
      case 'ArrowDown':
          currentElemPos = appData.componentData.findIndex(data => data.id === currentElem.elemId)
          while(currentElemPos < appData.componentData.length - 1){
            if(TEXT_INPUT_COMPONENT.includes(appData.componentData[currentElemPos+1].componentType)){
              this.props.setCurrentElem(appData.componentData[currentElemPos+1].id)
              break
            }
            currentElemPos++
          }
          break
      default:
        break;
    }
  }

  render(){
    let { showActionBtn } = this.state  
    // console.log(this.props)
    return( 
      <div 
        className="add-component-container" 
        ref={node => this.elem = node} 
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        data-block-id={this.props.id}
      >
        {this.props.children}
        <CSSTransition
          in={showActionBtn}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <React.Fragment>
            {
              <div className="text-type-tools" data-block-type="component-select-div" style={{display: this.state.html ? 'none' : 'flex'}}>
                <div data-type="Header1">
                  <i className="cm-h1" />
                </div>
                <div data-type="Header2">
                  <i className="cm-h2" />
                </div>
                {/* <div data-type="Olist" onClick={this.handleTypeSelect}>
                  <i className="cm-numbers" />
                </div>
                <div data-type="Ulist" onClick={this.handleTypeSelect}>
                  <i className="cm-bullets" />
                </div>
                <div>
                  <i className="cm-page" />
                </div> */}
                <div data-type="Upload">
                  <i className="cm-picture" />
                </div>
                <div data-type="Embed">
                  <i className="cm-video" /> 
                </div>
                {/* <div data-type="Upload" onClick={this.handleTypeSelect}>
                  <i className="cm-upload" /> 
                </div> */}
                <div data-type="Divider">
                  <i className="cm-divider" />  
                </div>
              </div>
            }
          </React.Fragment>
        </CSSTransition>
      </div>
    )
  }
}

const mapDispatchToProps = {
  addNewComponent,
  updateComponent,
  removeComponent,
  setCurrentElem
}

export default connect(state => state, mapDispatchToProps)(AddComponent)