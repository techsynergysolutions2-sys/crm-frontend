import React from 'react'
import {Button} from 'antd';

function PrimaryButton({title,fn}) {

  return (
   <Button onClick={() => fn()} style={{backgroundColor: '#5b2c6f', color: '#fff'}} >{title}</Button>
  )
}

export default PrimaryButton