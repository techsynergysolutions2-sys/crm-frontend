import React,{useState, useEffect,useMemo} from 'react';
import {useNavigate,useLocation } from 'react-router-dom'
import {Checkbox ,InputNumber ,Image ,Input,Select,Form,Upload,notification} from 'antd';
import './product.css';
import { PlusOutlined } from '@ant-design/icons';
import {fnCreateData,fnUpateData,fnFileURls,fnFileURls2,fnGetDirectData} from '../../shared/shared'
import AuditTrail from '../../components/AuditTrail';

const { Option } = Select;
const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });

const categories = [
    {id: 1, name: 'Electronics'},
    {id: 2, name: 'Fashion'},
    {id: 3, name: 'Home & Garden'},
    {id: 4, name: 'Sports & Outdoors'},
    {id: 5, name: 'Beauty & Health'}
]

const getBase64 = file =>
    new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [product, setProduct] = useState(location.state)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [openAuidt, setOpenAudit] = useState(false)


    const fnGoBack = () => {
        navigate('/inventory')
    }

    useEffect(() => {

        if(JSON.stringify(product) != "{}"){
            fetchData()
        }

    },[])

    const fetchData = async () => {
       
        let sql = `
                    SELECT a.uid,a.name,a.status,a.url FROM attachments a 
                    WHERE a.pageid = 2 AND a.recordid = ${product.id} AND a.isactive = 1`
        try {
        const data = await fnGetDirectData('attachments',sql);
        setFileList(data);
        } catch (error) {
        
        }
    
    };

    const onFinish = (values) => {
        
        if(fileList.length < 1){
            let placement = 'topRight'
            api.warning({
                title: ``,
                description: 'Please add pictures.',
                placement,duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
            });
            return
        }
        const fnSendData = async () => {
    
            if(JSON.stringify(product) === "{}" ){
                values['companyid'] = sessionStorage.getItem('companyid')
                values['createdby'] = sessionStorage.getItem('uid')
                values['instock'] = values['quantity']

                if(values['featured'] == true || values['featured'] == 1){
                    values['featured'] = 1
                }else{
                    values['featured'] = 0
                }

                if(values['isactive'] == true || values['isactive'] == 1){
                    values['isactive'] = 1
                }else{
                    values['isactive'] = 0
                }

                try {
                    const data = await fnCreateData('products',"products", values, 'new');
                    if(data.insertId != null || data.insertId != undefined){
                        
                        let temp = values
                        temp['id'] = data.insertId
                        fnUploadAllPhotos(data.insertId)
                        setProduct(temp)
                        let placement = 'topRight'
                        api.success({
                            title: ``,
                            description: 'Product added successfully.',
                            placement,duration: 2,
                            style: {
                                background: "#e2e2e2ff"
                            },
                            onClose: () => {
                               fnGoBack()
                            }
                        });
                    }else{
                        let placement = 'topRight'
                        api.error({
                            title: ``,
                            description: 'Something went wrong. Please try again',
                            placement,duration: 2,
                            style: {
                                background: "#e2e2e2ff"
                            },
                        });
                    }
                } catch (error) {
                    let placement = 'topRight'
                    api.error({
                        title: ``,
                        description: 'Something went wrong. Please try again',
                        placement,duration: 2,
                        style: {
                            background: "#e2e2e2ff"
                        },
                    });
                }
            }else{
                try {
                    if(values['featured'] == true || values['featured'] == 1){
                        values['featured'] = 1
                    }else{
                        values['featured'] = 0
                    }

                    if(values['isactive'] == true || values['isactive'] == 1){
                        values['isactive'] = 1
                    }else{
                        if(product.total_orders != 0){
                            let placement = 'topRight'
                            api.warning({
                                title: ``,
                                description: 'Product can not be deleted. There is an order linked to this product.',
                                placement,duration: 2,
                                style: {
                                background: "#e2e2e2ff"
                                },
                            });
                            return
                        }
                        values['isactive'] = 0
                    }
                    values['id'] = product['id']
                    values['updateby'] = sessionStorage.getItem('uid')
                    const data = await fnUpateData('products',"products", values,'id = ?',[product['id']], 'update');
                    if(data?.affectedRows > 0){
                        let placement = 'topRight'
                        api.success({
                            title: ``,
                            description: 'Product updated successfully.',
                            placement,duration: 2,
                            style: {
                                background: "#e2e2e2ff"
                            },
                            onClose: () => {
                               fnGoBack()
                            }
                        });
                        
                    }else{
                        let placement = 'topRight'
                        api.warning({
                            title: ``,
                            description: 'Something went wrong. Please try again',
                            placement,duration: 2,
                            style: {
                            background: "#e2e2e2ff"
                            },
                        });
                    }
                } catch (error) {
                    let placement = 'topRight'
                    api.warning({
                        title: ``,
                        description: 'Something went wrong. Please try again',
                        placement,duration: 2,
                        style: {
                        background: "#e2e2e2ff"
                        },
                    });
                }
                
            }
        }
    
        fnSendData()
    };

    const onFinishFailed = (errorInfo) => {
        let placement = 'topRight'
        api.warning({
            title: ``,
            description: 'Please complete the required fields.',
            placement,duration: 2,
            style: {
            background: "#e2e2e2ff"
            },
        });
    };



    const handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = async ({ fileList: newFileList }) => {

        if(JSON.stringify(product) != "{}"){
            let idx = newFileList.length - 1
            let arr = [newFileList[idx]]
            try {
                let url = await fnFileURls2(arr)
                if(url.length > 0){
                    let products = {
                        pageid: 2,
                        recordid: product.id,
                        name: url[0].name,
                        url: url[0].url,
                        createdby: sessionStorage.getItem('uid'),
                    }

                    await fnCreateData('attachments',"attachments", products, 'new');
                }
                
            } catch (error) {
                let placement = 'topRight'
                api.warning({
                    title: ``,
                    description: 'Something went wrong trying to upload. Please try again.',
                    placement,duration: 2,
                    style: {
                    background: "#e2e2e2ff"
                    },
                });
            }
            
        }
        
        setFileList(newFileList);
    }

    const fnUploadAllPhotos = async (productid) => {
        try {
            let urls = await fnFileURls2(fileList)
            for(let i = 0; i < urls.length; i++){

                let products = {
                    pageid: 2,
                    recordid: productid,
                    name: urls[i].name,
                    url: urls[i].url,
                    createdby: sessionStorage.getItem('uid'),
                }

                await fnCreateData('attachments',"attachments", products, 'new');
            }
        } catch (error) {
            let placement = 'topRight'
            api.warning({
                title: ``,
                description: 'Something went wrong trying to upload. Please try again.',
                placement,duration: 2,
                style: {
                background: "#e2e2e2ff"
                },
            });
        }
        

    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const fnDeleteFile = async (file) =>{
       
        let values = {
            isactive: 0
        }
        try {
        const data = await fnUpateData('attachments',"attachments", values,'uid = ?',[file['uid']], 'update');
        } catch (error) {
            let placement = 'topRight'
            api.warning({
                title: ``,
                description: 'Something went wrong. Please try again.',
                placement,duration: 2,
                style: {
                background: "#e2e2e2ff"
                },
            });
        }
    }

    const fnShowAudit = (val) =>{
        setOpenAudit(val)
    }

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
        {contextHolder}

        {/* Audit */}
        <AuditTrail recid={product?.id} pageid={2} showhide={openAuidt} fnShowAudit={fnShowAudit}/>

    <div className="add-product-page" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="container">
        <h1 className="page-title">Add New Product</h1>
            <div className="form-container">
                <Form name="basic" initialValues={product} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="product-name">Product Title</label>
                        <Form.Item name="title"
                        rules={[
                            {
                            required: true,
                            message: 'Please input title!',
                            },]} >
                            <Input size="large"/>
                        </Form.Item>
                    </div>
                    <div className="form-group">
                        <label htmlFor="product-category">Category</label>
                        <Form.Item
                        name="category"
                        rules={[
                            {
                            required: true,
                            message: 'Please select a category!',
                            },
                        ]}
                        >
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a category">
                            {
                            categories?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm.name}</Option>
                            ))
                            }
                        </Select>
                        </Form.Item>
                    </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="product-price">Price ($)</label>
                        <Form.Item name="price"
                        rules={[
                            {
                            required: true,
                            message: 'Please input price!',
                            },]} >
                            <InputNumber  size="large" style={{width: '100%'}}/>
                        </Form.Item>
                    </div>
                    <div className="form-group">
                        <label htmlFor="product-stock">Quantity</label>
                        <Form.Item name="quantity"
                        rules={[
                            {
                            required: true,
                            message: 'Please input quantity!',
                            },]} >
                            <InputNumber  size="large" style={{width: '100%'}}/>
                        </Form.Item>
                    </div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="product-description">Description</label>
                    <Form.Item label="" name="description" 
                     rules={[
                            {
                            required: true,
                            message: 'Please input description!',
                            },]}>
                        <TextArea rows={3}  />
                    </Form.Item>
                    </div>

                    <div className="form-group">
                    <label>Product Images</label>
                    <div className="file-upload">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={() => false}
                            onRemove={(file) => fnDeleteFile(file)}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: visible => setPreviewOpen(visible),
                                afterOpenChange: visible => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                            />
                            )}
                    </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="product-brand">Brand</label>
                        <Form.Item name="brand"
                        rules={[
                            {
                            required: true,
                            message: 'Please input brand!',
                            },]} >
                            <Input size="large"/>
                        </Form.Item>
                    </div>
                    <div className="form-group">
                        <label htmlFor="product-sku">SKU</label>
                        <Form.Item name="sku"
                        rules={[
                            {
                            required: true,
                            message: 'Please input sku!',
                            },]} >
                            <Input size="large"/>
                        </Form.Item>
                        
                    </div>
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <div className="checkbox-group">
                        <Form.Item name="featured" valuePropName="checked" label={null}>
                            <Checkbox>Feature this product</Checkbox>
                        </Form.Item>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="checkbox-group">
                        <Form.Item name="isactive" valuePropName="checked" label={null}>
                            <Checkbox>Product is active</Checkbox>
                        </Form.Item>
                        </div>
                    </div>
                    </div>

                    <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Save Product
                    </button>
                    {
                        JSON.stringify(product) === "{}" ? (
                            null
                        ):(
                            <button type="button" className="btn btn-secondary" onClick={() => fnShowAudit(true)}>
                                Audit
                            </button>
                        )
                    }
                    <button type="button" className="btn btn-light" onClick={() => fnGoBack()}>
                        Cancel
                    </button>
                    </div>
                </Form>
            </div>
      </div>
    </div>
    </Context.Provider>
  );
};

export default Product;