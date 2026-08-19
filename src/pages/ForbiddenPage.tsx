import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面"
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  )
}