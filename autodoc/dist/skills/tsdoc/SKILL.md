---
name: tsdoc
description: use this to document a Typescript interfaces and types file
---

# Instructions

## Step 1

Open the file. Read related files if needed to understand the types.

Then verify that all the docstrings are present for each code block: list missing or incorrect docstrings and examples. Example report:

**Missing docstrings**: 
    - `class_name`, `function_name`
**Missing examples**:
    - `interface_name`, `type_name`
**Incorrect doc or examples**: 
    - `interface_name`: missing the "data" parameter
**Incorrect docstrings**: 
    - `function_name`: the property "url" documented as `string | undefined` should be of type `string`
**Problems details**:
    - `function_name`: The property `prop` is incorrectly documented as `number | undefined` instead of `string | undefined`

Verify all the code blocks in the file. Avoid writing code, only report. 

If you found no missing or incorrect docstrings or examples report it, no next step is needed in this case

## Step 2

If the report show some non minor issues rewrite the file with the correct documentation according to the report.

## Step 3

If the file was rewriten verify it's content vs the report to double check everything is correct

## Reference: TSDoc Writing Instructions

Follow these guidelines to write clear, standardized documentation using TSDoc. **Every TSDoc comment must include an `@example` unless explicitly stated otherwise.**

### 1. File Header
Include a TSDoc comment at the top of every file to describe its purpose, imports, and usage examples.

```typescript
/**
* @file Manages user authentication logic, including validation and session management.
* Imports: Utilizes `bcrypt` for password hashing and `express` for routing.
* @example
* // Example of importing and using a function from this file
* import { authenticateUser } from './auth';
* authenticateUser('user@example.com', 'password');
*/
```

### 2. Class Header
Document classes with purpose, inheritance, properties, and example usage.

```typescript
/**
* A class representing a user with authentication and session management.
* @class
* @augments BaseUser
* @param {string} email - The user's email address.
* @param {string} sessionId - Unique session identifier.
* @example
* const user = new AuthenticatedUser('user@example.com', 'securePassword');
* user.login(); // Example method call
*/
class AuthenticatedUser extends BaseUser {}
```

### 3. Method Header
Describe methods with parameters, return types, exceptions, and examples.

```typescript
/**
* Validates and authenticates a user's credentials.
* @param {string} email - User's email address.
* @param {string} password - User's password.
* @returns {boolean} `true` if authentication succeeds, `false` otherwise.
* @throws {InvalidCredentialsError} If email or password are invalid.
* @example
* const isAuthenticated = user.authenticate('user@example.com', 'password');
* console.log(isAuthenticated); // Example usage
*/
authenticate(email: string, password: string): boolean {}
```

### 4. Function Header
Document standalone functions with parameters, return types, and examples.

```typescript
/**
* Hashes a password using bcrypt.
* @param {string} password - The plaintext password.
* @returns {string} The hashed password string.
* @example
* const hashed = hashPassword('securePassword');
* console.log(hashed); // Example output
*/
function hashPassword(password: string): string {}
```

### 5. Variable/Header
Document variables with type, purpose, and example references.

```typescript
/**
* @type {Map<string, User>} Maps user emails to their User objects.
* @example
* const userMap = new UserStorage();
* const user = userMap.get('user@example.com'); // Example access
*/
const userMap = new Map<string, User>();
```

### 6. Useful Tags (Expanded List)
- `@param` - Describe parameters.
- `@returns` - Describe return values.
- `@throws` - Describe exceptions.
- `@type` - Document variable types.
- `@const` - Mark constants.
- `@augments` - Inherit from parent classes.
- `@see` - Reference related documentation.
- `@example` - **Mandatory** in all docstrings.
- `@since` - Version when feature was introduced.
- `@version` - Current version.
- `@deprecated` - Mark deprecated features.
- `@abstract` - Mark abstract classes/methods.
- `@inheritdoc` - Inherit documentation from parent.

### 7. Complex Code Documentation
Use TSDoc to explain complex logic with detailed examples.

```typescript
/**
* Encrypts data using AES-256 with a generated key.
* Steps: Generate key → Encrypt data → Return ciphertext.
* @param {Buffer} data - Data to encrypt.
* @returns {string} Base64 encoded ciphertext.
* @example
* const encrypted = encryptData(Buffer.from('secret'));
* console.log(encrypted); // Example output
*/
function encryptData(data: Buffer): string {}
```

### 8. Type Definitions
Define custom types with `@typedef` and examples.

```typescript
/**
* @typedef {Object} User
* @param {string} email - User's email address.
* @param {string} role - User's role (e.g., 'admin').
* @example
* const user: User = {
*   email: 'user@example.com',
*   role: 'admin'
* };
*/
```

### 9. Modules
Document modules with their purpose and example imports.

```typescript
/**
* @module auth
* Provides authentication utilities like password hashing and session management.
* @example
* import { hashPassword } from './auth';
*/
```

### 10. Interfaces
Document interfaces using `@property`, use `@example`.

```typescript
/**
* Represents the statistics of an inference prompt ingestion time.
*
* @interface IngestionStats
* @property {number} ingestionTime - The time taken to ingest the input data in milliseconds.
* @property {number} ingestionTimeSeconds - The time taken to ingest the input data in seconds.
* @example
* const ingestionStats: IngestionStats = {
*   ingestionTime: 150,
*   ingestionTimeSeconds: 0.15
* };
*/
interface IngestionStats {
    ingestionTime: number;
    ingestionTimeSeconds: number;
}
```

### 11. Constants
Use `@const` to document constants with examples.

```typescript
/**
* @const {number} MAX_LOGIN_ATTEMPTS - Maximum allowed login attempts per user.
* @example
* if (attempts >= MAX_LOGIN_ATTEMPTS) {
*   blockUser(); // Example usage
* }
*/
const MAX_LOGIN_ATTEMPTS = 3;
```

### Final Notes
- **Always include `@example`** in every TSDoc block to illustrate usage.
- Use **clear, concise, and consistent** language.
- Document **all parameters**, return types, and exceptions.