import { Alert, Button, Card, Form, Select, Space, Table, Tag, Typography, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useAuth } from '../useAuth'
import { ALL_ROLES, ALL_PERMISSIONS } from '../permissions'
import type { User } from '../types'

export function UserManagementPage() {
  const { listUsers, updateUserRoles, deleteUser, user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const list = await listUsers()
      setUsers(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (u: User) => {
    setEditingUser(u)
    form.setFieldsValue({ roles: u.roles })
  }

  const handleSave = async () => {
    if (!editingUser) return
    try {
      const values = await form.validateFields()
      await updateUserRoles(editingUser.id, values.roles)
      message.success('更新成功')
      setEditingUser(null)
      form.resetFields()
      fetchUsers()
    } catch {
      // form validation error, handled by antd
    }
  }

  const handleDelete = async (u: User) => {
    if (u.id === currentUser?.id) {
      message.warning('不能删除当前登录用户')
      return
    }
    await deleteUser(u.id)
    message.success('删除成功')
    fetchUsers()
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space>
          {roles.map((r) => {
            const roleDef = ALL_ROLES.find((role) => role.key === r)
            return <Tag key={r} color="blue">{roleDef?.name ?? r}</Tag>
          })}
        </Space>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, u: User) => (
        <Space>
          <Button size="small" type="link" onClick={() => handleEdit(u)}>
            编辑角色
          </Button>
          <Button
            size="small"
            type="link"
            danger
            disabled={u.id === currentUser?.id}
            onClick={() => handleDelete(u)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="oa-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="oa-page__title" style={{ margin: 0 }}>用户管理</h1>
        <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
          刷新
        </Button>
      </div>

      <Card bordered={false} style={{ border: '1px solid #eef0f3' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={false}
        />
      </Card>

      {editingUser && (
        <Card
          title={`编辑用户角色 - ${editingUser.displayName}`}
          bordered={false}
          style={{ marginTop: 16, border: '1px solid #eef0f3' }}
          extra={
            <Button type="link" onClick={() => setEditingUser(null)}>
              取消
            </Button>
          }
        >
          <Form form={form} layout="vertical" style={{ maxWidth: 500 }}>
            <Form.Item
              name="roles"
              label="角色"
              rules={[{ required: true, message: '请选择至少一个角色' }]}
            >
              <Select
                mode="multiple"
                placeholder="选择角色"
                options={ALL_ROLES.map((r) => ({
                  value: r.key,
                  label: `${r.name} - ${r.description}`,
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleSave}>
                  保存
                </Button>
                <Button onClick={() => setEditingUser(null)}>取消</Button>
              </Space>
            </Form.Item>
          </Form>

          <Alert
            message="该用户将获得以下权限"
            description={
              <Space size={[4, 4]} wrap>
                {(editingUser.permissions.length > 0
                  ? editingUser.permissions
                  : ALL_ROLES.find((r) => r.key === editingUser.roles[0])?.permissions ?? []
                ).map((perm) => {
                  const permDef = ALL_PERMISSIONS.find((p) => p.key === perm)
                  return <Tag key={perm}>{permDef?.name ?? perm}</Tag>
                })}
              </Space>
            }
            type="info"
            showIcon
            style={{ marginTop: 8 }}
          />
        </Card>
      )}

      <Card
        title="权限说明"
        bordered={false}
        style={{ marginTop: 16, border: '1px solid #eef0f3' }}
      >
        <Typography.Text type="secondary">
          系统定义了以下角色，每个角色拥有不同的权限组合：
        </Typography.Text>
        <Space direction="vertical" style={{ marginTop: 12 }}>
          {ALL_ROLES.map((r) => (
            <Card
              key={r.key}
              size="small"
              title={
                <Space>
                  <Tag color="purple">{r.name}</Tag>
                  <Typography.Text type="secondary">{r.description}</Typography.Text>
                </Space>
              }
            >
              <Space size={[4, 4]} wrap>
                {r.permissions.map((p) => {
                  const permDef = ALL_PERMISSIONS.find((x) => x.key === p)
                  return <Tag key={p}>{permDef?.name ?? p}</Tag>
                })}
              </Space>
            </Card>
          ))}
        </Space>
      </Card>
    </div>
  )
}