import { Alert, Button, Form, Input, Typography, message } from 'antd'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'

interface RegisterFormValues {
  username: string
  displayName: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { register, isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true)
    setError(null)
    try {
      await register({
        username: values.username,
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      message.success('注册成功，请登录')
      navigate('/login', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '注册失败')
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
            加入 Zdy OA
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>
            创建账户，开启高效办公之旅
          </Typography.Text>
          <div style={styles.brandFeatures}>
            {['快速注册，即刻使用', '安全的数据保护', '7×24 小时支持'].map((f) => (
              <div key={f} style={styles.brandFeature}>
                <span style={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.formSide}>
          <div style={styles.formWrapper}>
            <div style={{ marginBottom: 24 }}>
              <Typography.Title level={3} style={{ margin: 0, color: '#1a1a2e' }}>
                创建账户
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                填写以下信息完成注册
              </Typography.Text>
            </div>

            {error && (
              <Alert
                message="注册失败"
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 20 }}
              />
            )}

            <Form<RegisterFormValues>
              name="register"
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="用户名（字母、数字、下划线）"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="displayName"
                rules={[{ required: true, message: '请输入显示名称' }]}
              >
                <Input
                  placeholder="显示名称"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="邮箱地址"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="密码（至少6位）"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次密码不一致'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="再次输入密码"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 8 }}>
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
                  {loading ? '注册中...' : '创建账户'}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  已有账户？
                </Typography.Text>
                <Button
                  type="link"
                  onClick={() => navigate('/login')}
                  style={{ padding: '0 4px', fontSize: 13 }}
                >
                  返回登录
                </Button>
              </div>
            </Form>
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
    padding: '24px 0',
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
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    background: '#fff',
  },
  brandSide: {
    flex: '1 1 45%',
    background: 'linear-gradient(160deg, #722ed1 0%, #1677ff 100%)',
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
    padding: '40px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
  },
}