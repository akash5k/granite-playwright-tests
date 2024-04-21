import { Page, expect } from "@playwright/test"

interface TaskDetails {
    taskName: string,
    commentText: string
}

export class TaskDetailsPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //add and and Check if the comment persists on the page.
    addCommentAndVerify = async ({ taskName, commentText }: TaskDetails) => {
        await this.page.getByTestId("tasks-pending-table").getByText(new RegExp(taskName, "i")).click();
        await this.page.getByTestId('comments-text-field').fill(commentText);
        await this.page.getByTestId('comments-submit-button').click();
        await expect(this.page.getByTestId("task-comment")).toContainText(commentText)
    }


}