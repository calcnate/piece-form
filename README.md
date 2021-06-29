# Piece Form

`Piece Form`是一个高性能的表单组件，使用了 mutable 的方式来管理表单状态，无论表单有多少个字段，每次 update 都只会更新正在操作的那个字段，具体可参考[demo](https://piece123.netlify.app/src-doc-performace)。

### Start

```
yarn dev
open http://localhost:3000/
```

### Usage：

```
<Form
  onSubmit={(values) => {
    console.log(values);
  }}
>
  <div>
    <label>username: </label>
    <Field name="name">
      <input
        placeholder="username"
        autoComplete="off"
      />
    </Field>
  </div>
  <div>
    <label>password: </label>
    <Field name="password">
      <input placeholder="password" type="password" autoComplete="off" />
    </Field>
  </div>
  <button type="submit">Submit</button>
</Form>
```
