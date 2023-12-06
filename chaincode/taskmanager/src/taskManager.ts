/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Context, Contract, Info, Returns, Transaction} from "fabric-contract-api";
import {v4 as uuidv4} from 'uuid';
import {Task} from "./task";

@Info({ title: 'TaskManager', description: 'Smart contract for managing Tasks' })
export class TaskManagerContract extends Contract{

    /**
     * Creates a new task in the ledger
     * @param ctx
     * @param title
     * @param description
     * @param status
     */
    @Transaction()
    public async createTask(ctx: Context, title: string, description: string, status: string): Promise<void> {
        const taskId = uuidv4();
        const createdAtDate: string = new Date().toISOString();

        const task: Task = {
            id: taskId,
            title: title,
            description: description,
            status: status,
            createdAt: createdAtDate,
            updatedAt: createdAtDate,
            deletedAt: null
        };
        const buffer: Buffer = Buffer.from(JSON.stringify(task));
        await ctx.stub.putState(taskId, buffer);
    }

    /**
     * Returns a task found in the ledger
     * @param ctx
     * @param taskId
     */
    @Transaction(false)
    public async readTask(ctx: Context, taskId: string): Promise<string> {
        const exists = await this.taskExists(ctx, taskId);
        if (!exists) {
            throw new Error(`The task with id ${taskId} does not exist`);
        }
        const buffer: Buffer = await ctx.stub.getState(taskId) as Buffer;
        return buffer.toString();
    }

    /**
     * Returns all tasks found in the ledger
     * @param ctx
     */
    @Transaction(false)
    @Returns('string')
    public async readAllTasks (ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    /**
     * Updates a task in the ledger with new field values
     * @param ctx
     * @param taskId
     * @param title
     * @param description
     * @param status
     * @param createdAt
     * @param updatedAt
     * @param deletedAt
     */
    @Transaction()
    public async updateTask(ctx: Context, taskId: string, title: string, description: string, status: string, createdAt: string, updatedAt: string, deletedAt: string): Promise<void> {
        const exists: boolean = await this.taskExists(ctx, taskId);
        if (!exists) {
            throw new Error(`The task ${taskId} does not exist`);
        }
        const updatedTask: Task = {
            id: taskId,
            title: title,
            description: description,
            status: status,
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: deletedAt
        };
        const buffer: Buffer = Buffer.from(JSON.stringify(updatedTask));
        await ctx.stub.putState(taskId, buffer);
    }

    /**
     * Deletes a task from the ledger
     * @param ctx
     * @param taskId
     */
    @Transaction()
    public async deleteTask(ctx: Context, taskId: string): Promise<void> {
        const exists: boolean = await this.taskExists(ctx, taskId);
        if (!exists) {
            throw new Error(`The task ${taskId} does not exist`);
        }
        await ctx.stub.deleteState(taskId);
    }

    /**
     * Checks if a task exists in the ledger
     * @param ctx
     * @param taskId
     */
    @Transaction()
    @Returns('boolean')
    public async taskExists(ctx: Context, taskId: string): Promise<boolean> {
        const buffer: Buffer = await ctx.stub.getState(taskId) as Buffer;
        return (!!buffer && buffer.length > 0);
    }
}