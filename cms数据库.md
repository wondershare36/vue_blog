# 1.博客后台 API 接口文档

## 1.1.APIV1接口说明

- 接口基准地址: http://localhost/
- 数据返回格式统一使用 JSON

### 1.1.1. 支持的请求方法

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。
- HEAD：获取资源的元数据。
- OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。



### 1.1.2. 通用返回状态说明

| *状态码* | *含义*                | *说明*                                              |
| -------- | --------------------- | --------------------------------------------------- |
| 200      | OK                    | 请求成功                                            |
| 201      | CREATED               | 创建成功                                            |
| 204      | DELETED               | 删除成功                                            |
| 400      | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数                |
| 401      | UNAUTHORIZED          | 未授权                                              |
| 403      | FORBIDDEN             | 被禁止访问                                          |
| 404      | NOT FOUND             | 请求的资源不存在                                    |
| 422      | Unprocesable entity   | [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误 |
| 500      | INTERNAL SERVER ERROR | 内部错误                                            |
|          |                       |                                                     |



## 1.2. 文章分类

### 1.2.1. 获取文章分类列表

- 请求路径：article/class
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注 |
| ------ | -------- | ---- |
|        |          |      |
|        |          |      |

- 响应数据

```json
{
    "msg": "success",
    "code": 200,
    "data": [
        {
            "id": 1,
            "class_name": "html/css/js"
        },
        {
            "id": 2,
            "class_name": "Vue"
        },
        {
            "id": 4,
            "class_name": "3"
        }
    ]
}
```

### 1.2.2. 添加文章分类

- 请求路径：article/class
- 请求方法：post
- 请求参数

| 参数名     | 参数说明 | 备注     |
| ---------- | -------- | -------- |
| class_name | 分类名称 | 不能为空 |
|            |          |          |

- 响应数据

```json
{
    "msg": "success",
    "code": 201,
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 4,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}
```

### 1.2.3. 删除文章分类

- 请求路径：article/class
- 请求方法：delete
- 请求参数

| 参数名     | 参数说明 | 备注 |
| ---------- | -------- | ---- |
| class_name | 分类名称 |      |
|            |          |      |

- 响应数据

```json
{
    "msg": "success",
    "code": 204,
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 4,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}
```

### 1.2.4. 修改文章分类

- 请求路径：article/class
- 请求方法：put
- 请求参数

| 参数名     | 参数说明 | 备注 |
| ---------- | -------- | ---- |
| id         | 分类id   |      |
| class_name | 分类名称 |      |

- 响应数据

```json
{
    "msg": "success",
    "code": 201,
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
        "protocol41": true,
        "changedRows": 1
    }
}
```

### 1.2.5. 根据id获取文章分类

- 请求路径：article/class
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注 |
| ------ | -------- | ---- |
|        |          |      |
|        |          |      |

- 响应数据

```json
{
    "msg": "success",
    "code": 200,
    "data": [
        {
            "id": 1,
            "class_name": "html/css/js"
        },
        {
            "id": 2,
            "class_name": "Vue"
        },
        {
            "id": 4,
            "class_name": "3"
        }
    ]
}
```

## 1.3. 文章

### 1.3.1. 获取文章列表

- 请求路径：article/list
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注 |
| ------ | -------- | ---- |
|        |          |      |

- 响应数据

```json
{
    "meta": {
        "msg": "success",
        "status": 200
    },
    "data": [
        {
            "id": 1,
            "title": "Vue",
            "desb": "Vue的文档",
            "class_id": 2
        }
    ]
}
```

### 1.3.2. 根据id获取文章

- 请求路径：article/list/:id
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| id     | 文章id   | 不能为空`携带在url中` |

- 响应数据

```json
{
    "meta": {
        "msg": "success",
        "status": 200
    },
    "data": {
        "id": 16,
        "title": "测试标题",
        "content": "测试内容",
        "desb": "简要摘要",
        "class_id": 2
    }
}
```

### 1.3.3. *添加文章*

- 请求路径：article/list/:class_id
- 请求方法：post
- 请求参数

| 参数名   | 参数说明       | 备注                  |
| -------- | -------------- | --------------------- |
| class_id | 分类id         | 不能为空`携带在url中` |
| title    | 文章标题       | 不能为空              |
| content  | 文章内容       | 不能为空              |
| desb     | 文章摘要、描述 |                       |

- 响应数据

```json
{
    "meta": {
        "msg": "success",
        "status": 201
    },
    "data": {
        "class_id": "16",
        "title": "测试标题",
        "content": "测试内容",
        "desb": "简要摘要",
        "id": 21
    }
}
```

### 1.3.3. 删除文章

- 请求路径：article/list/:id
- 请求方法：delete
- 请求参数

| 参数名 | 参数说明 | 备注                  |
| ------ | -------- | --------------------- |
| id     | 文章id   | 不能为空`携带在url中` |

- 响应数据

```json
{
    "meta": {
        "msg": "success",
        "status": 204
    },
    "data": {
        "class_id": "16",
        "title": "测试标题",
        "content": "测试内容",
        "desb": "简要摘要",
        "id": 21
    }
}
```

### 1.3.4. 修改文章

- 请求路径：article/list/:id/:class_id
- 请求方法：put
- 请求参数

| 参数名   | 参数说明 | 备注                  |
| -------- | -------- | --------------------- |
| id       | 文章id   | 不能为空`携带在url中` |
| class_id | 分类id   | 不能为空`携带在url中` |
| title    | 标题     | 不能为空              |
| content  | 内容     | 不能为空              |
| desb     | 简要摘要 |                       |

- 响应数据

```json
{
    "meta": {
        "msg": "success",
        "status": 201
    },
    "data": {
        "class_id": "16",
        "title": "测试标题",
        "content": "测试内容",
        "desb": "简要摘要",
        "id": 21
    }
}
```

### 1.3.4. 获取导航栏菜单

- 请求路径：getMenuList
- 请求方法：get
- 请求参数

| 参数名 | 参数说明 | 备注 |
| ------ | -------- | ---- |
|        |          |      |

- 响应数据

```json
{
    "meta": {
        "msg": "success",
        "status": 200
    },
    "data": {
        "class_id": "16",
        "title": "测试标题",
        "content": "测试内容",
        "desb": "简要摘要",
        "id": 21
    }
}
```

