import * as fs from 'fs';
import * as path from 'path';

interface AIImageOptions {
    service: string;
    model: string;
    token: string;
    path: string;
    prompt: string;
    timeout: number;
    aspectRatio: string;
}

interface TaskResult {
    task_id: string;
    created: number;
    status: string;
    status_message: string;
    data: Array<{
        index: number;
        url: string;
    }>;
    quantity: number;
}

export class Ext {
    public static async runImage(options: AIImageOptions) {
        switch (options.service) {
            case 'qiniu':
                return await this.qiniu(options);
            default:
                console.log(`Ext ${options.service} not found`);
        }
    }

    public static async qiniu(options: AIImageOptions) {
        let token = options.token;
        let timeout = options.timeout * 1000;
        let toPath = options.path;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "model": options.model,
            "prompt": options.prompt,
            "aspect_ratio": options.aspectRatio
        });

        let requestOptions: any = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let resp = await fetch("https://api.qnaigc.com/v1/images/generations", requestOptions)
            .then(response => response.json());
        let task_id = resp.task_id
        console.log("任务ID = " + task_id);
        if (!task_id) {
            throw new Error(resp.error || '创建任务失败')
        }

        /// 查询任务
        async function queryTask(task_id: string) {
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            /**
             {
             "task_id": "image-1762159125266058362-1383010xxx",
             "created": 1761793032,
             "status": "succeed",
             "status_message": "成功",
             "data": [
             {
             "index": 0,
             "url": "https://aitoken-image.qnaigc.com/1383010xxx/image-1761793032508597404-1383010xxx/0.png?e=1763089082&token=IDB69r4gicDbMfrecarthgw1btTTWEFNg9i5_yasXqhp:JapC2EihLvSADMficht3pZVn5Xc="
             }
             ],
             "quantity": 1
             }
             /// 失败

             */
            return await fetch(`https://api.qnaigc.com/v1/images/tasks/${task_id}`, requestOptions as any)
                .then(response => response.json());
        }

        /// 迭代查询
        const startTime = Date.now();
        const pollInterval = 2000; // 每2秒查询一次


        while (true) {
            // 检查是否超时
            const elapsed = Date.now() - startTime;
            if (elapsed > timeout) {
                throw new Error(`任务超时：超过 ${timeout}ms 未完成`);
            }

            // 查询任务状态
            const result: TaskResult = await queryTask(task_id);

            console.log('result.status = ', result.status)
            // 任务成功
            if (result.status === 'succeed') {
                // 下载并保存文件到本地
                for (const item of result.data) {
                    const filename = path.basename(new URL(item.url).pathname);
                    const filepath = path.join(toPath, filename);
                    await Ext.downloadFile(item.url, filepath);
                }
                return result;
            }

            // 任务失败
            if (result.status === 'failed') {
                throw new Error(result.status_message || '任务执行失败');
            }

            // 任务进行中，等待后重试
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
    }

    /// 下载文件到本地
   public static async downloadFile(url: string, filepath: string): Promise<void> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`下载文件失败: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 确保目录存在
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filepath, buffer);
    }
}
