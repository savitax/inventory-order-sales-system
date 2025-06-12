import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
export default function UploadFile(props) {
    const { setFile, title } = props;
    const defaultProps = {
        name: 'file',
        action: '',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                setFile(info.file);
            }
        },
        beforeUpload: file => false
    };
    return (
        <Upload.Dragger {...defaultProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传 <i><b>{title}</b></i></p>
        </Upload.Dragger>
    )
}
