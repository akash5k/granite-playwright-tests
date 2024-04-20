// tasks.spec.ts

import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Tasks page", () => {
    let taskName: string;

    test.beforeEach(() => {
        taskName = faker.word.words({ count: 5 });
    });

    test("should create a new task with creator as the assignee", async ({
        page,
        taskPage,
    }) => {
        await page.goto("/");
        await taskPage.createTaskAndVerify({ taskName });
    });

    test("should be able to mark a task as completed", async ({
        page,
        taskPage,
    }) => {
        await page.goto("/");
        await taskPage.createTaskAndVerify({ taskName });
        await taskPage.markTaskAsCompletedAndVerify({ taskName });
    });

    test("should be able to delete a completed task", async ({
        page,
        taskPage,
    }) => {
        await page.goto("/");
        await taskPage.createTaskAndVerify({ taskName });
        await taskPage.markTaskAsCompletedAndVerify({ taskName });
        const completedTaskInDashboard = page
            .getByTestId("tasks-completed-table")
            .getByRole("row", { name: taskName });

        await completedTaskInDashboard
            .getByTestId("completed-task-delete-link")
            .click();

        await expect(completedTaskInDashboard).toBeHidden();
        await expect(
            page
                .getByTestId("tasks-pending-table")
                .getByRole("row", { name: taskName })
        ).toBeHidden();
    });

    test("should be able to star a pending task", async ({ page, taskPage }) => {
        page.goto("/");
        await taskPage.createTaskAndVerify({ taskName });
        await taskPage.starTaskAndVerify({ taskName });
    });

    test("should be able to un-star a pending task", async ({
        page,
        taskPage,
    }) => {
        page.goto("/");
        await taskPage.createTaskAndVerify({ taskName });
        await taskPage.starTaskAndVerify({ taskName });
        const starIcon = page
            .getByTestId("tasks-pending-table")
            .getByRole("row", { name: taskName })
            .getByTestId("pending-task-star-or-unstar-link");
        await starIcon.click();
        await expect(starIcon).toHaveClass(/ri-star-line/);
    });
});