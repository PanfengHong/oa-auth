import { Alert, Button, Checkbox, Form, Input, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../useAuth'

interface LoginFormValues {
  username: string
  password: string
  remember?: boolean
}

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { login, isAuthenticated, loading: authLoading } = useAuth()

  const redirect = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : ((location.state as { from?: { pathname: string } })?.from?.pathname) || '/dashboard'

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(redirect, { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate, redirect])

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    setError(null)
    try {
      await login({
        username: values.username,
        password: values.password,
        remember: values.remember,
      })
      message.success('登录成功，欢迎回来')
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.bgDecor} />
      <div style={styles.container}>
        <div style={styles.brandSide}>
          <div style={styles.brandLogo}>OA</div>
          <Typography.Title level={2} style={{ color: '#fff', margin: '16px 0 8px' }}>
            Zdy OA
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>
            企业办公自动化系统
          </Typography.Text>
          <div style={styles.brandFeatures}>
            {['高效审批流程', '多端协同办公', '精细化权限管理'].map((f) => (
              <div key={f} style={styles.brandFeature}>
                <span style={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.formSide}>
          <div style={styles.formWrapper}>
            <div style={{ marginBottom: 28 }}>
              <Typography.Title level={3} style={{ margin: 0, color: '#1a1a2e' }}>
                欢迎回来
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                请登录您的账户以继续使用
              </Typography.Text>
            </div>

            {error && (
              <Alert
                message="登录失败"
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 20 }}
              />
            )}

            <Form<LoginFormValues>
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="用户名"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="密码"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Typography.Link onClick={() => navigate('/register')}>
                    注册新账户
                  </Typography.Link>
                </div>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: 44,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                    border: 'none',
                    fontWeight: 500,
                  }}
                >
                  {loading ? '登录中...' : '登 录'}
                </Button>
              </Form.Item>
            </Form>

            <div style={styles.formFooter}>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                测试账户：admin / admin123
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgDecor: {
    position: 'absolute',
    top: -200,
    right: -200,
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
    opacity: 0.08,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    width: 900,
    maxWidth: '95vw',
    minHeight: 520,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    background: '#fff',
  },
  brandSide: {
    flex: '1 1 45%',
    background: 'linear-gradient(160deg, #1677ff 0%, #722ed1 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#fff',
  },
  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
    color: '#fff',
    backdropFilter: 'blur(10px)',
  },
  brandFeatures: {
    marginTop: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  brandFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#52c41a',
    boxShadow: '0 0 0 4px rgba(82,196,26,0.25)',
  },
  formSide: {
    flex: '1 1 55%',
    padding: '48px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  formFooter: {
    textAlign: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTop: '1px solid #f0f0f0',
  },
}