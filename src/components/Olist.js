import React from 'react'
import ContentEditable from './ContentEditable'
import withComponent from './withComponent'
import '../styles/components/List.css'

const WrappedOlist = (props) =>  {
  console.log('all props', props)
  return(
    <div className="cm-o-list">
      <ContentEditable 
          html={props.html} 
          onChange={props.handleChange}
          onInputChange={props.onInputChange}
          placeholder="Numbered list"
          className="cm-text-block"
          id={props.id}
          listOrder={<span>{props.order}.</span>}
      />
    </div>
  )
}

export const Olist = withComponent(WrappedOlist) 