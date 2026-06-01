## File: agents/1.overview.md
````markdown
# Agents

An agent definition is similar to a task, with the ability to call tools.

- <a href="javascript:openLink('/terminal_client/agents/tools_call')">Tool calls</a>: local tools from other *tasks*, *actions* or *workflows*
- <a href="javascript:openLink('/terminal_client/agents/mcp')">Mcp servers</a>: use tools from mcp servers
- <a href="javascript:openLink('/terminal_client/agents/subagents')">Sub agents</a>: use agents inside other agents
- <a href="javascript:openLink('/terminal_client/agents/tools_routing')">Tools routing agents</a>: grouped tool calls

The agent can use a user defined tools set, autonomously or in a supervised way, asking the user for permission. Each tool has
it's own permissions.


<a href="javascript:openLink('/terminal_client/agents/tools_call')">Next: Tool calls</a>
````

## File: agents/2.tools_call.md
````markdown
# Tools call

An agent can use tools calls. A tool can be defined from another action, task or wokflow.

## Action tools

Check the `examples/tools.js` example in the repository for full code.

We will define two actions tools. The first one, `weather.py`, in an `action` folder:

```python
"""
# tool
name: weather
description: Get the current weather
arguments:
    city:
        description: The city or location, e.g. San Francisco, CA
"""

# Fake action
print('{"temp": 18, weather: "rain"}')
```

Note the comment on top that describes the action for the model. Second action tool, `traffic.js`:

```js
/*
# tool
name: traffic
description: Get the current road traffic conditions
arguments:
    city:
        description: The city or location, e.g. San Francisco, CA
*/

async function action(args) {
    return { "traffic": "normal" }
}

export { action }
```

Run `lm update` to register the new actions tools.

Now let's declare those tools in a `toolsexample.yml` task:

```yaml
description: Tools use example
prompt: |-
    {prompt}
template:
    afterSystem: |-
        
        You are an AI touristic assistant
ctx: 8192
model:
    name: qwen3:4b
    template: chatml-tools
inferParams:
    top_k: 20
    top_p: 0.95
    min_p: 0
    temperature: 0.2
    max_tokens: 4096
toolsList:
    - weather # from the tool declared in actions/weather.py
    - traffic # from the tool declared in actions/traffic.js
```

Run `lm update` to register the task and then run the command:

```bash
lm toolsexample "I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. \
How are the conditions in the city?"
```

Output of <kbd>Qwen 3 4b</kbd>:

```
⚒️  Executing [toolsexample] weather { city: 'Barcelona' }
⚒️  Executing [toolsexample] traffic { city: 'Barcelona' }
The weather in Barcelona is currently 18°C with rain, so you might want to consider indoor sports if you're planning outdoor activities. Traffic conditions are normal, so you should have no issues with getting around the city. Let me know if you need further assistance! 🌂🌧️
```

## System actions tools

A system action can be a task. Example:

```yaml
tool:
  description: Get documentation from an `man` page for a given shell command
  arguments:
    command:
        description: "The command name. Example: `find` or `chmod`"
cmd: man
args:
  - "-P"
  - "cat"
```

## Tasks tools

A task can be a tool if it has a `tool` section. Example:

```yaml
tool:
    description: "Evaluate a shell command's' correctness and security. Provides a confidency score between 0.0 and 1.0 for both correctness and security"
    arguments:
        prompt: 
            description: The initial user request
        command: 
            description: The command to analyze
# ... yaml content of the task
```

## Tools execution permissions

A tool in toolsList is by default executed automatically. To ask user to confirm or deny execution add a `?` mark at the end of the tool name:

```yaml
description: Tools use example
# ...
toolsList:
    - weather?
    - traffic
```

In the example above the weather tool must get the user permission to be executed and the traffic tool is automatically executed

<a href="javascript:openLink('/terminal_client/mcp')">Next: Mcp</a>
````

## File: agents/3.mcp.md
````markdown
# Mcp tools

To use mcp servers add them to a task:

```yaml
description: Mcp example
prompt: |-
    {prompt}
ctx: 16384
model:  
  name: qwen4b
  template: chatml-tools
inferParams:
  top_k: 20
  top_p: 0.80
  min_p: 0
  temperature: 0.2
  max_tokens: 8192
mcp:
  sqlite-read:
    command: uvx
    arguments:
      - mcp-server-sqlite
      - "--db-path"
      - ~/.config/agent-smith/cli/config.db
    tools:
      - list_tables
      - describe_table
      - read_query
```

In this example we use a Sqlite tool with a limited set of authorized tools: the
optional "tools" section is a list of authorized tools. If not provided all the tools
from the server will be available.

### Command line parameters

To add command line parameters for a mcp server use the `--mcp` option. Example:

```yaml
# ...
name: fsagent
mcp:
  filesystem:
    command: npx
    arguments:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
    tools:
      - list_directory
      - read_text_file
      - write_file?
```

This server needs an argument for allowed directories. To specify allowed directories when running the agent:

```bash
lm fsagent "list the files in the current directory" --mcp filesystem:.
```

In this example the agent can only operate in the current directory. To specify multiple directories use multiple
arguments separated by a comma:

```bash
lm fsagent "my prompt here" --mcp filesystem:/path/one,~/path/two
```

For multiple servers:

```bash
lm fsagent "my prompt here" --mcp filesystem:. otherserver:arg1,arg2
```

## Tools execution permissions

A tool is by default executed automatically. To ask user to confirm or deny execution add a `?` mark at the end of the tool name:

```yaml
description: Mcp example
# ...
mcp:
  sqlite-read:
    command: uvx
    arguments:
      - mcp-server-sqlite
      - "--db-path"
      - ~/.config/agent-smith/cli/config.db
    tools:
      - list_tables
      - describe_table
      - read_query
      - write_query?
```

In the example above the `write_query` tool must get the user permission to be executed and the read tools are automatically executed

<a href="javascript:openLink('/plugins')">Next: Plugins</a>
````

## File: agents/4.subagents.md
````markdown
# Subagents

An agent can use another agent like a tool. 

Example: we want our main agent to have the ability to create shell commands, but we don't want to use too much context window or have many tools available, so we will create a shellcmd subagent equiped with it's own tools.

The main agent has a `shellcmd` tool that is a subagent:

```yaml
description: An agent
prompt: |-
    {prompt}
ctx: 8192
model:
    name: qwen4b
    template: chatml-tools
inferParams:
    min_p: 0.05
    top_k: 40
    top_p: 0.95
    temperature: 0.5
toolsList:
    - shellcmd
```

The `shellcmd` subagent has it's own tools to execute it's specific mission:

```yaml
# agents/shellcmd.yml
tool:
    description: Write a shell command
    arguments:
        prompt: 
            description: The user request
name: shellcmd
description: Write a shell command using tools
prompt: |-
    {prompt}
template: 
    afterSystem: |-
        
        You are an AI programmer specialized in bash shell commands. Here is your workflow:

        - Evaluate the task and first grab documentation if useful (To retrieve documentation use the "dump-manpage" tool for simple commands, use doc-shell-cmd for commands with subcommands).
        - Important: you always use the "check-shellcmd" tool to evaluate the command security and correctness.
        - In your final answer always output only the command and the evaluation.

        Use the "check-shellcmd" tool to get an evaluation then provide your answer with this format:

        ```
        <command>command here</command>

        - Correctness: number
        - Security: number

        Security warning and recommandations if any
        Alternative secured command if any

        Short additional notes if needed
        ```
ctx: 8192
model:
    name: qwen4b
    template: chatml-tools
inferParams:
    min_p: 0
    top_k: 20
    top_p: 0.95
    temperature: 0.4
toolsList:
    - dump-manpage
    - check-shellcmd
```

This agent has tools: a simple system `dump-manpage` system tool:

```yaml
tool:
  description: Get documentation from an `man` page for a given shell command
  arguments:
    command:
        description: "The command name. Example: `find` or `chmod`"
cmd: man
args:
  - "-P"
  - "cat"
```

And a task `check-shellcmd`:

```yaml
tool:
    description: "Evaluate a shell command's' correctness and security. Provides a confidency score between 0.0 and 1.0 for both correctness and security"
    arguments:
        prompt: 
            description: The initial user request
        command: 
            description: The command to analyze
name: check-shellcmd
description: Check a shell command
prompt: |-
    We requested another AI to write a shell command. Initial user request: "{prompt}"

    The AI created this command:

    ```bash
    {command}
    ```

    Analyze the user request and review the command to check for:

    - **Correctness**: the command must do exactly what is requested by the user. Verify that it does it all correctly
    - Security problems if this command is run: only check for serious problems      
    - Simplicity and best practices: suggest alternatives if you find a better way to do what the user requested

    Provide a confidency score between 0.0 and 1.0 in you final report for:

    - Correctness
    - Security

    Suggest the good command if the correctness score is not 1.0
template: 
    system:  |-
        You are an AI programmer assistant for shell commands. You are in charge of the security and
        quality control.
ctx: 16384
model:    
    name: qwen30b
    template: chatml-tools
inferParams:
    temperature: 0
    max_tokens: 8192
variables:
    required:
        command:
            description: The shell command to check for
```
````

## File: agents/5.tools_routing.md
````markdown
# Tools routing agent

The tools routing agents take a query and returns the raw result of a tool call. A subagent will use
it's tools and run inference using the tools results. A tools routing agent will just run the appropriate
tool and return the raw tool call result. Usage: to centralize tool calls and keep the parent agent's
context window and tools number minimal.

Example: a simple filesystem tools routing agent:

```yaml
# agents/filesystem.yml
tool:
    description: Filesystem tool. It can list directories content, read and write files.
    arguments:
        prompt: 
            description: "The prompt query: to list a given dir, read or write a file. Example query: directory listing: /path/to/dir. Other example: write to file /path/to file/ this content: `filecontent here`."
description: Filesystem routing agent
prompt: |-
    Call the relevant tool to execute this user query:

    {prompt}
template:
    afterSystem: |-
        
        You are an AI filesystem assistant. You are equiped with tools to operate on the filesystem.
ctx: 32768
model:
    name: qwen4b
    template: chatml-tools
inferParams:
    top_k: 20
    top_p: 0.7
    min_p: 0
    temperature: 0.2
mcp:
  filesystem:
    command: npx
    arguments:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - /path/to/authorized/dir
      - /home/me/agent-smith/packages/agent
    tools:
      - list_directory
      - read_text_file
      - write_file?
```

Important: to declare an agent as a tools routing agent mention the words "routing agent" in the agent's description.

Run `lm update` to register your agent

Use this agent in a parent agent:

```yaml
# agents/myagent.yml
description: An agent
# ...
toolsList:
    - fs
```

Run the agent:

```bash
> cd agent-smith/packages/agent # any path specified in the mcp server arguments
# you can also run lm "some prompt" --mcp filesystem:. to allow the current dir for the filesystem agent
> lm myagent "how many dependencies does the project in the current directory has?"
```

Output:

```
I need to check the current directory to determine how many dependencies the project has. First, I'll list the contents of the current directory to look for files that might contain dependency information (like package.json, requirements.txt, etc.).

⚒️  myagent => filesystem { prompt: 'directory listing: .' }
Secure MCP Filesystem Server running on stdio
Client does not support MCP Roots, using allowed directories set from server args: [ '/home/me/agent-smith/packages/agent' ]
⚒️  filesystem => list_directory { path: '.' }
The project in the current directory has a `package.json` file, which typically contains dependency information for JavaScript/Node.js projects. I'll examine the `package.json` file to determine how many dependencies it has.

⚒️  myagent => filesystem { prompt: 'read file package.json' }
Secure MCP Filesystem Server running on stdio
Client does not support MCP Roots, using allowed directories set from server args: [ '/home/me/agent-smith/packages/agent' ]
⚒️  filesystem => read_text_file { path: 'package.json' }
The project has **3 dependencies** listed in the `package.json` file under the `dependencies` section:

1. `@locallm/api` ^0.7.3  
2. `modprompt` ^0.12.6  
3. `restmix` ^0.6.1  

These are the direct dependencies required for the project to function. Additionally, there are 9 devDependencies, but those are not counted as project dependencies. 

So, the total number of dependencies is **3**.
```
````

## File: 1.install.md
````markdown
# Install

Install the Agent Smith terminal client globally:

```bash
npm i -g @agent-smith/cli
```

A global `lm` command is available once installed.

## Quickstart

Install the inference plugin:

```bash
npm i -g @agent-smith/feat-inference
```

Create a `config.yml` file:

```yml
plugins:
  - "@agent-smith/feat-inference"
backends:
  default: "llamacpp"
  local: # locally supported backends
    - "llamacpp"
    - "koboldcpp"
    - "ollama"
  openrouter:
    type: "openai"
    url: "https://openrouter.ai/api/v1"
    apiKey: "$OPENROUTER_API_KEY"
  llamacpp_oai: # llama.cpp openai compatible api
    type: "openai"
    url: "http://localhost:8080/v1"
```

Run the conf command to initialize:

```bash
lm conf ~/path/to/config.yml
```

### Inference

Run an inference query with the <kbd>q</kbd> command:

```bash
lm q list the planets of the solar system
```

The default model is qwen4b. To use another model:

```bash
lm q list the planets of the solar system -m gemma4b
```

### Tasks

List the available tasks:

```bash
lm tasks
```

Show a task:

```bash
lm task infer
```

<a href="javascript:openLink('/terminal_client/overview')">Next: Overview</a>
````

## File: 2.overview.md
````markdown
# Overview

The terminal client is a runtime to execute simple tasks or more complex pipelines
involving language models. Principles:

- **Declarative**: the features to execute are declared in an easy to edit human readable format
- **Composable**: compose tasks, actions, workflows and custom commands

## Features

Different type of features can be declared: tasks, actions, workflows and commands.

### Tasks

A task is a language model predefined query: the prompt, template, sampling paramaters and model
are preset for the task. The format to declare a task is yaml. Quick example:

```yaml
name: explain
description: Explain code
prompt: |-
      I have this code:

      ```
      {prompt}
      ```

      Explain what the code does in details
template: 
    name: deepseek
    system: You are an AI programmer assistant
model:
    name: deepseek-coder:6.7b
    ctx: 8192
inferParams:
    min_p: 0.05
    temperature: 0.2
```

For a detailled reference of the format see the <a href="javascript:openLink('/libraries/lm_task')">Lm task doc</a>

## Actions

An action is a system command or custom code run. It is used to retrieve or process data. An action can be:

- A system command
- A Javascript script
- A Python script

A system command is declared in yaml. Example:

```yaml
cmd: git
args:
  - diff
```

A Javascript action:

```js
import { execute } from "@agent-smith/cli";

async function action(args, options) {
    const diff = await execute("git", ["diff", ...args]);
    if (options.verbose || options.debug) {
        console.log("Executing", "git diff", args.join(" "));
    }
    let msg = diff;
    const stagedDiff = await execute("git", ["diff", "--staged", ...args]);
    if (options.verbose || options.debug) {
        console.log("Executing", "git diff --staged", args.join(" "));
    }
    if (stagedDiff.length > 0) {
        msg += "\n" + stagedDiff
    }
    if (options.debug) {
        console.log(msg)
    }
    const res = { prompt: msg };
    return res
}

export { action }
```

A Python command is just a Python script:

```python
print("result data")
```

Note: actions are not listed as independant commands. They are used in workflows and custom commands.

## Workflows

A workflow is a suite of actions and tasks. It is declared in yaml:

```yaml
title: "Generate a git commit message from a git diff"
steps:
  - action: git_diff
  - task: commit_msg
```

The result of the action is automatically passed as a parameter
for the next step: here the git diff message is passed to the language model task

## Commands

All the tasks, actions, jon and commands can run in interactive cli mode or as single commands. 
Run the `lm` command to launch the client, and then run commands. Example to list the available
tasks:

```bash
lm
> tasks
```

Example of the same command as single terminal command:

```bash
lm tasks
```

Custom commands are scripts used to run multiple steps pipelines. Some
functions are available to manage the interactivity with the user.

<a href="javascript:openLink('/terminal_client/commands')">See the commands section</a>

<a href="javascript:openLink('/terminal_client/config')">Next: Config</a>
````

## File: 3.config.md
````markdown
# Config

The custom features (tasks, workflows, actions and commands) are located either
in a local folder or in a js plugin.

You can declare your custom features in a config file.
Create a `features/config.yml` file:

```yml
promptfile: /home/me/lm/features/prompt.txt
features:
  - /home/me/lm/features/dist
plugins:
  - "@agent-smith/feat-git"
```

All are optional. The promptfile is a file that can be used for input for
inference tasks. See the <a href="javascript:openLink('/terminal_client/tasks')">tasks</a>
section for more info about input modes.

Update your client config using this file by running this command:

```bash
lm conf ~/lm/features/config.yml
```

## Backends

Agent Smith support different kinds of backends:

- [Llama.cpp](https://github.com/ggerganov/llama.cpp)
- [Koboldcpp](https://github.com/LostRuins/koboldcpp)
- [Ollama](https://github.com/ollama/ollama)
- Any server that supports an Openai compatible api

To configure your backends in `config.yml`:

```yaml
backends:
  default: "llamacpp"
  local: 
    - "llamacpp"
    - "koboldcpp"
    - "ollama"
  openrouter:
    type: "openai"
    url: "https://openrouter.ai/api/v1"
    apiKey: "$OPENROUTER_API_KEY"
  llamacpp_oai:
    type: "openai"
    url: "http://localhost:8080/v1"
```

The backend listed in `local` are default local instances of these servers. The
other ones are custom configs. By default the cli will use the backend configured
in `default`.

List available backends:

```bash
lm backends
```

To change the default backend in the command line:

```bash
lm backend openrouter
```

To use a given backend once for a given task:

```bash
lm mytask "my prompt" -b koboldcpp
```

## Local features

The features are declared in a folder (here `/home/me/lm/features/dist`) using
these subfolders:

- actions
- tasks
- workflows
- cmds

All are optional.

Every new feature will be detected when running `lm update` and then be available

<a href="javascript:openLink('/terminal_client/tasks')">Next: Tasks</a>
````

## File: 4.tasks.md
````markdown
# Tasks

A task is a prompt for a language model, defined in yaml

## List tasks

The `tasks` command, see the example above

## Read a task

To read a task details:

```bash
lm task mytask
```

It will display the task in json

## Run a task

```bash
lm mytaskname "param 1"
```

For an `infer.yml` task:

```yml
name: infer
description: A test inference task
ctx: 8192
prompt: |-
    {prompt}
model:
    name: mistral:instruct
    ctx: 4092
inferParams:
    min_p: 0.05
    temperature: 0.2
```

All the tasks require a prompt parameter. To run this task with a custom prompt:

```bash
lm infer "List the planets in the solar system"
```

The top `ctx` parameter is the default context lenght for the task

## Inference parameters

The following parameters can be used to control the inference process. For a full list of available parameters, 
see the <a href="javascript:openLink('/libraries/lm_task/specification')">LmTask specification</a>:

- `--model (-m)`: Specify the model name (e.g., `phi3.5:latest`)
- `--ctx (-x)`: Set context window size
- `--template (--tpl)`: Define the template format (e.g., `chatml`, `deepseek2`)
- `--max_tokens (--mt)`: Limit the number of generated tokens
- `--top_k (-k)`: Filter results to top K candidates
- `--top_p (-p)`: Use cumulative probability thresholding
- `--min_p (--mp)`: Set minimum probability for token consideration
- `--temperature (-t)`: Control randomness in sampling (0=deterministic, 1=maximum randomness)
- `--repeat_penalty (-r)`: Adjust penalty for repeated tokens
- `--verbose (-v)`: Enable verbose output
- `--debug (-d)`: Show debug information
- `--tokens`: Toggle token visualization mode
- `--chat (-c)`: Enable chat mode for interactive tasks

### Examples

#### Model override

To use a different model than the one specified in the task use
the `-m` flag:

```bash
lm infer "List the planets in the solar system" -m qwen3:4b
```

The program will try to guess the template to use, based on the name of
the model. It works for well known models. To specify a template:

```bash
lm infer "prompt here" -m some_model --tpl chatml
```

#### Cumulative Sampling Parameters

1. **Top-k and Top-p with Temperature:**

   ```bash
   lm infer "Generate a creative story about a futuristic city" --top_k 50 --top_p 0.95 --temperature 0.7
   ```

   This command uses top-k filtering to consider the top 50 tokens, top-p (nucleus sampling) with a cumulative probability threshold of 0.95, and a temperature of 0.7 to introduce some randomness.

2. **Min Probability and Repeat Penalty:**

   ```bash
   lm infer "Explain quantum mechanics in simple terms" --min_p 0.01 --repeat_penalty 1.2
   ```

   This command sets a minimum probability threshold for token consideration at 0.01 and applies a repeat penalty of 1.2 to discourage the model from repeating tokens.

3. **Combining Multiple Parameters:**

   ```bash
   lm infer "Describe the process of photosynthesis" --top_k 40 --top_p 0.9 --temperature 0.5 --min_p 0.02 --repeat_penalty 1.1
   ```

   This command combines top-k filtering, nucleus sampling, temperature control, minimum probability threshold, and repeat penalty to fine-tune the inference process.

#### Debug, Verbose, Show Tokens Modes

1. **Verbose Mode:**

   ```bash
   lm infer "What is the capital of France?" -v
   ```

   This shows the thinking process for thinking models, and displays the inference parameters used.

2. **Debug Mode:**

   ```bash
   lm infer "Translate 'Hello world' to Spanish" -d
   ```

   This command shows debug information, which can be useful for troubleshooting and understanding the internal workings of the model.

3. **Show Tokens Mode:**

   ```bash
   lm infer "Generate a poem about nature" -t
   ```

   This command toggles token visualization mode, displaying the tokens generated by the model during inference.

#### Chat Mode

1. **Chat Mode Example:**

   ```bash
   lm infer "Start a conversation about AI ethics" --chat
   ```

   This command enables chat mode, allowing for interactive conversations with the language model.

## Task parameters config

The tasks have encoded parameters, like a model or inference parameters. To change these
parameters and save them for next runs for a given task: example:

```bash
lm task mytask -b openrouter -t 0.5 -m "mistralai/mistral-small-3.1-24b-instruct:free"
```

This will use the backend openrouter, a temperature of 0.5 and the mistralai/mistral-small-3.1-24b-instruct:free model
for next runs of this task. Check the task config:

```bash
lm task mytask
```

Remove the task config:

```bash
lm task mytask --reset
```

Show the config for all tasks:

```bash
lm tasks -c
```

This will display the config of all the tasks in yaml. Note you can add this yaml
at the bottom of `config.yml` to save it if your database is recreated: useful for
development purposes.

## Input mode

An inference task requires a prompt. Example `infer.yml` task:

```yaml
name: explain
description: Explain code
prompt: |-
      I have this code:

      ```
      {prompt}
      ```

      Explain what the code does in details
template: 
    name: deepseek
    system: You are an AI programmer assistant
model:
    name: deepseek-coder:6.7b
    ctx: 8192
inferParams:
    min_p: 0.05
    temperature: 0.2
```

### Command line input

By default the input is taken from a command line parameter:

```bash
lm infer "some prompt"
```

### Clipboard input

To use input from the clipboard copy some code and run the command
with the `--ic` option:

```bash
lm explain --ic
```

### Promptfile input

The input can be taken from a prompt file. First declare the prompt
file path in your config and update it: `features/config.yml`:

```yml
promptfile: /home/me/lm/features/src/prompt.txt
# ...
```

You can now edit the file and use it as prompt input:


```bash
lm explain --if
```

## Output mode

### Markdown output

To render a pretty print of markdown text and code:

```bash
lm some_code_task ---omd "my prompt"
```

### Clipboad output

To copy the output of a task into the clipoard use the `--oc` option. Note:
the input and output options can be combined. Example of a clipoard input
and output:

```bash
lm some_code_task --ic --oc
```

## System prompt

Use the template section to add a system prompt:

```yaml
name: tsdoc
description: Create a Jsdoc docstring for a block of code
ctx: 8192
template: 
    name: chatml
    system: |-
        You are an AI programming assistant. Your task is to create detailled and helpful
        documentation.
```

## Assistant block and stop tokens

To make the assistant response start use the template block,. It is useful for 
better autocomplete and formating in some cases:

```yaml
template: 
    name: deepseek2
    system: |-
        You are an AI programming assistant. Your task is to create detailled and helpful
        documentation.
    stop:
        - "```"
    assistant: |-
        Here is the docstring:

        ```ts
```

## Shots

It is possible to use few shots prompting in a task definition. Example with
a create Python docstring task:

```yaml
name: py_docstring
description: Create a Google style docstring for Python code
ctx: 8192
prompt: |-
    in Python create a detailed and helpful Google style docstring for this code:

    ```python
    {prompt}
    ```

    Always provide a short example in the docstring. The code is formatted with Black. 
    Important: output only the docstring
model:
    name: DeepSeek-Coder-V2-Lite-Instruct-Q8_0
    template: deepseek2
inferParams:
    temperature: 0
shots:
    - user: |-
          def add(a: float, b: float = 2.5) -> float:
            if a < 0:
                raise ValueError("Provide a positive number for a")
            try:
                return a + b
            except Exception as e:
                raise (e)
          
      assistant: |-
          """
          Sums two float numbers, but ensures the first number is non-negative. If the
          second number is not provided, it defaults to 2.5.

          Args:
              a (float): The first number to be added. Must be a non-negative float.
              b (float, optional): The second number to be added. Defaults to 2.5. Can be
                  any float.

          Returns:
              float: The sum of a and b.

          Raises:
              ValueError: If \`a\` is negative.
              Exception: Any unexpected error that might occur during addition.

          Example:
              >>> add(2.5)
              5.0
              >>> add(2.5, 3.5)
              6.0
              >>> add(-1.0)
              ValueError: Provide a positive number for a
          """
```

## Variables

A task always take a `prompt` input. It is possible to add custom variables in
the prompt. 

### Required variables

```yaml
name: translate
description: A translation task
ctx: 4096
prompt: |-
    Translate this text to {lang}:

    ```
    {prompt}
    ```
model:  
  name: qwen4b
  template: chatml
inferParams:
  min_p: 0.05
  temperature: 0.2
  max_tokens: 2048
variables:
  required:
    lang:
      type: string
      description: The language to translate to
```

The `lang` variable is required. To run the task with a lang value;

```bash
lm translate "some sentence" --lang spanish
```

Note: everytime you change variables in a task run `lm update` to register the changes

### Optional variables

```yaml
name: a_task
ctx: 8192
prompt: |-
      {prompt}{instructions}
variables:
    optional:
        instructions:
          type: string
          description: Custom optional instructions
```

Here the `instructions` variable is optional:

```bash
lm a_task --ic --instructions "Adopt a very formal tone"
```

In this example the prompt is the content of the clipboard (see the `--ic` option doc)

# Fragments

Fragments are a way to include content from some files into the prompt. Example: I have a somecode.py file
that I want to include in a prompt:

```yaml
prompt: |-
    I have some code:
    
    ```python
    {file:../somecode.py}
    ```

    {prompt}
# ...
```

The file path is relative to the task file path, or absolute.

It also works for `template.system` and `template.afterSystem`.


<a href="javascript:openLink('/terminal_client/actions')">Next: Actions</a>
````

## File: 6.actions.md
````markdown
# Actions

An action is a system command or custom code run. It is used to retrieve or process data. An action can be:

- A system command
- A Python script
- A Javascript script

Note: actions are not listed as independant commands. They are used in workflows and custom commands.

## System actions

To define an action that runs a system command we use the
yaml format:

```yaml
cmd: ls
```

The action's ouput will be the result of the command.

To use parameters:

```yaml
name: ocr
cmd: /home/ggg/me/path/to/some/app/.venv/bin/python
args:
  - "/home/ggg/me/path/to/some/app/ocr.py"
  - "-x"
  - "--a-param"
  - "0"
```

All the parameters are strings.

It is possible to run an action with some additional command line parameters. 
To run the above action with parameters:

```bash
lm ocr some_img.jpg
```

## Python actions

To declare a `hello.py` action:

```python
import sys

print("args:", sys.argv)
print("Hello world")
```

Run the action:

```bash
lm hello param1 "params two"
```

The output of the action will be the printed statements. For example
for an ocr task just print the output to pass the result to the eventual
next step of a job.

## Javascript actions

To create a quick action in a `dist/actions` folder use a `.js` extension for your action:

```js
async function action(args) {
    const data = doSomething();    
    if (somethingIsWrong) {
        throw new Error("something went wrong")
    }
    // pass the result data for the next node
    return data
}

export { action }
```

System commands can be used in javascript actions. Example action
to read a file and pass the result to the next step of a job:

```js
import { execute } from "@agent-smith/cli";

async function action(args) {
    const data = await execute("cat", args);
    return { fileContent: data }
}

export { action }
```

<a href="javascript:openLink('/terminal_client/workflows')">Next: Workflows</a>
````

## File: 7.workflows.md
````markdown
# Workflows

A workflow is a pipeline of *actions*, *tasks* or *commands* that run in a sequence. It is
is defined in yaml.

Example `features/workflows/commit_msg.yml` workflow that uses
the `features/actions/git_diff.js` action and the `features/tasks/commit_msg.yml` task:

```yaml
title: "Generate a git commit message from a git diff"
steps:
  - action: git_diff
  - task: commit_msg
```

Note: the result of an action or task is passed to the next one, except for the special case of *adaptaters*.

## Adaptaters

An adaptater is a javascript script that manipulates data between
two workflow steps, often to convert data and adapt required formats.

Adaptaters are declared in a `adaptaters` folder of a plugin. Example: an
adaptater to parse command line input. The <kbd>q</kbd> wokflow from the
<a href="javascript:openLink('/plugins/inference')">inference plugin</a>.
Workflow:

```yaml
steps:
  - adaptater: prequery
  - task: infer
```

This adaptater parses the command line arguments and dispatch them for the `infer` task
that will run next in the workflow:

```js
// adaptaters/prequery.js
async function action(params, options) {
    const res = { prompt: params.join(" ") };
    return res;
}

export { action }
```

Usage:

```bash
lm q list the planets of the solar systems
# equivalent to the single task:
lm infer "list the planets of the solar systems"
```

<a href="javascript:openLink('/terminal_client/commands')">Next: Commands</a>
````

## File: 8.commands.md
````markdown
# Commands

A custom command is a [Commander.js](https://github.com/tj/commander.js) command. It is used to run multiple steps pipelines
that require user interactivity or custom options. Example: `mycommand.js` in a `cmds` directory in a registered feature directory:

```js
import select from '@inquirer/select';
import { 
    execute, executeTask, writeToClipboard, init
} from "@agent-smith/cli";

const choices = [
    {
        name: 'Commit',
        value: 'commit',
        description: 'Run the commit command with this message',
    },
    {
        name: 'Copy',
        value: 'copy',
        description: 'Copy the commit message to the clipboard',
    },
    {
        name: 'Cancel',
        value: 'cancel',
        description: 'Cancel the commit',
    },
];

async function run(args, options) {
    await init();
    if (options?.verbose) {
        console.log("Generating a commit message ...");
    }   
    const res = await executeTask("git_commit", args, options);
     const answer = await select({
        message: 'Select an action',
        default: "commit",
        choices: choices,
    });
    switch (answer) {
        case "copy":
            writeToClipboard(final)
            break;
        case "commit":
            console.log("git commit -m", res.answer.text);
            const res2 = await execute("git", ["commit", ...args, "-m", res.answer.text]);
            console.log(res2);
            break;
        default:
            console.log("Commit canceled");
            break;
    }
}

const cmd = {
    name: "commit [args...]",
    description: "Commit cmd",
    options: [
        "all",
        ["--pkg <name>", "commit for a given package"],
        ["--msg <name>", "the first line commit message"],
        ["--instructions <prompt>", "additionl optional instructions"]
    ],
    run: run
};

export { cmd };
```

Options are either an array at the Commander Option format or a string for a predefined
options set. Predefined options sets:

- *all*: all options
- *inference*: inference options
- *display*: debug and verbose options
- *io*: input and output option


<a href="javascript:openLink('/terminal_client/agents/overview')">Next: Agents</a>
````
