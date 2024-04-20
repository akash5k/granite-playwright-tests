import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";
import { TaskDetailsPage } from "../poms/taskDetails";


test.describe("Task Details Page", async () => {
    let taskName: string;
    let commentText: string;

    test.beforeEach(() => {
        taskName = faker.word.words({ count: 5 });
        commentText = faker.word.words({ count: 15 });
    });

    test("Add a new comment as a creator of a task in the task details page", async ({
        page,
        taskDetailsPage,
        taskPage,
        loginPage,
        browser }) => {
        await test.step("Step 1 : Login, create a task and add a comment as a creator to the task ", async () => {
            await page.goto("/");
            await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" });
            await taskDetailsPage.addCommentAsCreatorAndVerify({ taskName, commentText });
        })
        await test.step("Step 2 : Check if the count to the comment is correct or not on the tasks page", async () => {
            await page.goto("/");
            await taskPage.checkCommentCount({ taskName });
        })

        await test.step("Step 3 : Login as assignee and check if the comment is visible", async () => {
            // Creating a new browser context and a page in the browser without restoring the session
            const newUserContext = await browser.newContext({
                storageState: { cookies: [], origins: [] },
            });
            const newUserPage = await newUserContext.newPage();

            // Initializing the login POM here because the fixture is configured to use the default page context
            const loginPage = new LoginPage(newUserPage);
            const taskDetailsPage = new TaskDetailsPage(newUserPage)

            await newUserPage.goto("/");
            await loginPage.loginAndVerifyUser({
                email: "sam@example.com",
                password: "welcome",
                username: "Sam Smith",
            });
            await test.step("Step 3.1 : Check comment is visible when you sign in as the assignee for the task", async () => {
                await newUserPage.goto("/")
                await newUserPage.getByTestId("tasks-pending-table").getByText(new RegExp(taskName, "i")).click();
                await expect(newUserPage.getByTestId("task-comment")).toContainText(commentText);
            })
            await test.step("Step 3.2 : Check comment count", async () => {
                await newUserPage.goto("/")
                await taskPage.checkCommentCount({ taskName })
            })
        })
    })



})