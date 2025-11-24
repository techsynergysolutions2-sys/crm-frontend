import {useState, useEffect} from 'react'
import {Button,Col, Row,Modal,Table } from 'antd';
import {fnGetDirectData } from '../shared/shared'

function AuditTrail({recid,pageid,showhide,fnShowAudit}) {

    const columnsAudit = [
        {
          title: 'Description',
          dataIndex: 'description',
        },
        {
          title: 'Employee',
          dataIndex: 'fullname',
        },
        {
            title: 'Date',
            render: (record) => {
                // console.log(record.createddate)
                const localDate = new Date(record.createddate);
                // console.log(localDate)
                // console.log(localDate.toLocaleString("en-ZA"))
                return(
                     <>
                        {/* {record.createddate?.replace('T', ' ')} */}
                        {localDate.toLocaleString("en-ZA")}
                    </>
                )
            },
        },
      ];

      const [audtModal, setAuditModal] = useState(false)
      const [audit, setAudit] = useState([])

      useEffect(() => {
        setAuditModal(showhide)
        fnGetAudit()
      },[])

      const fnGetAudit = async () =>{
        try {
            const sql = `
                SELECT a.id,a.description,a.createddate,
                    CONCAT(e.firstname, ' ', e.lastname) AS fullname
                    FROM audit_trail a
                    JOIN employees e
                    ON e.id = a.createdby
                    WHERE a.pageid = ${pageid}  AND a.recordid = ${recid}
                `
            if(recid != undefined || recid == ''){
                const data = await fnGetDirectData('audit',sql);
                setAudit(data)
            }
            
        } catch (error) {
            setAudit([])
        }
      }

      const fnOpenCloseModal = () =>{
        setAuditModal(showhide)
      }

  return (
    <Modal title="Audit Trail" open={showhide} width={1000} onCancel={() => fnShowAudit(false)} maskClosable={true}
        footer={
            <Button onClick={() => fnShowAudit(false)}>
            Cancel
            </Button>
        }
    >
        
        <Row style={{marginTop: 40}}>
            <Col span={24}>
            <Table
                columns={columnsAudit}
                dataSource={audit}
                rowKey='id'
                showSorterTooltip={{
                target: 'sorter-icon',
                }}
            />
            </Col>
        </Row>
    </Modal>
  )
}

export default AuditTrail