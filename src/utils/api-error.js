class ApiError extends Error{
    constructor(statusCode,message = "Something went wrong",data,error = [],stack = ""){
        super(message);
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.error = error
        this.success = false
        // Flexibility for Passed Stacks: If a developer catches a low-level database error or external API error,
        // they might want to pass that original error's stack trace into ApiError to keep the historical debugging context.
        // The if (stack) block handles this case: this.stack = stack.


        // Why do we use stack there? 
        // Because when an API error happens (like a user typing the wrong password), 
        // you want to know exactly which file and line number triggered that failure.

        // What does Error.captureStackTrace do?
        //  By default, the stack trace would include the internal code inside your ApiError file.
        // You don't care about debugging the ApiError tool itself; you care about debugging the file where the user logged in. 
        // captureStackTrace basically tells the computer: "Hey, ignore the lines of code inside the ApiError file when printing the error. 
        // Start the breadcrumbs trail from the actual file that caused the problem."
        if (stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
export {ApiError}