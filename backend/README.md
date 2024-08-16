### 本地运行后端  并导入课程数据

* 安装mysql数据库 8.0.37
* use '**mysql -u root -p -h localhost -P 3306**' run the database
* 安装requirement文件中的依赖
* 确保config文件中的数据库设置改成自己的用户名和密码(将YOURDATABASEPASSWORD常量设置成自己的数据库密码)
  

* 查看所有现存数据库
  * ```sql
    SHOW DATABASES;
    ```

* 如有数据库comp9900s,先删除.
  * ```sql
    DROP DATABASE comp9900s;
    ```

* 创建数据库comp9900s

  * ```sql
    CREATE DATABASE IF NOT EXISTS comp9900s;
    ```

* 运行init_db.py
  * ```python
    python3 init_db.py
    ```

* 最后运行run.py启动项目
  * ```python
    python3 run.py
    ```