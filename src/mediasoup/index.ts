import { Worker, RtpParameters, WorkerSettings } from 'mediasoup/lib/types'
import { createWorker } from "mediasoup";

type CPUTime = {
    lastCPUTimestamp: number
    last5: number
    last10: number
    last15: number
    avg15: number
    avgLifetime: number
}

type WorkerInfo = {
    mediasoupWorker: Worker
    cpuInfo: CPUTime
    createdAt: number
} 

export default class WorkerManager {
    private mediasoupWorkerArr: Array<WorkerInfo>

    private shouldClose: boolean = false;
    private workerOptions: WorkerSettings = process.env.NODE_ENV === 'development' ? {logLevel: 'debug'} : {logLevel: 'error'}

    constructor() {
        createWorker(this.workerOptions).then((worker) => {
            const initialWorker: WorkerInfo = {
                mediasoupWorker: worker,
                cpuInfo: {
                    lastCPUTimestamp: 0,
                    last5: 0,
                    last10: 0, 
                    last15: 0,
                    avg15: 0,
                    avgLifetime: 0
                },
                createdAt: Date.now()
            };

            this.mediasoupWorkerArr = [initialWorker];
            this.startCpuMonitor();
        });
    }

    private startCpuMonitor = async () => {
        while(!this.shouldClose) {
            await setTimeout(() => {
                this.updateCpuInfo();
            }, 5000);
        }
    }

    private updateCpuInfo = async () => {
        this.mediasoupWorkerArr.forEach(async workerInfo => {
            const workerUsage = await workerInfo.mediasoupWorker.getResourceUsage();
            const lastCpuInfo = workerInfo.cpuInfo;
            const totalWorkerTime = workerUsage.ru_utime + workerUsage.ru_stime;
            const elapsedWorkerTime = totalWorkerTime - lastCpuInfo.lastCPUTimestamp;
            
            workerInfo.cpuInfo = {
                lastCPUTimestamp: totalWorkerTime,
                last5: elapsedWorkerTime,
                last10: lastCpuInfo.last5 + elapsedWorkerTime,
                last15: lastCpuInfo.last10 + elapsedWorkerTime,
                avg15: (lastCpuInfo.last10 + elapsedWorkerTime) / 15,
                avgLifetime: totalWorkerTime / ((Date.now() - workerInfo.createdAt) / 1000)
            };
        });
    }

    private createNewWorker = () => {
        createWorker(this.workerOptions).then((worker) => {
            const newWorker: WorkerInfo = {
                mediasoupWorker: worker,
                cpuInfo: {
                    lastCPUTimestamp: 0,
                    last5: 0,
                    last10: 0, 
                    last15: 0,
                    avg15: 0,
                    avgLifetime: 0
                },
                createdAt: Date.now()
            };

            this.mediasoupWorkerArr.push(newWorker);
        });
    }

    private getReccomendedWorker = () => new Promise<WorkerInfo>((resolve) => {
        const reccomendedWorker = this.mediasoupWorkerArr.reduce((previous, current): WorkerInfo => {
            if(current.cpuInfo.avg15 < previous.cpuInfo.avg15 - 15) {
                return current;
            } else {
                return previous;
            }
        });

        resolve(reccomendedWorker);
    })
}