import React from 'react'
import { Avatar, List,Typography} from 'antd';

function SentCard({item,index}) {
  return (
    <List.Item style={{position: 'relative'}}>
        <List.Item.Meta
            description={item.notes}
        />
    </List.Item>
  )
}

const Styles = {
    text: {
      fontFamily: "'Poppins', sans-serif",
    }
  }

export default SentCard