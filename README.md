Fleet stop with fields and regex parameters

# Installation
```bash
npm install -g fleet-stopregex
```

# Usage
```bash
fleet-stopregex --field [command, commit, pid] <regex> <regex flags>
```
The script matches the regular expression against the specified all field for every spawned process. For any process which matches, that process is then killed

If field is omitted then **pid** will be used as the default.

Note that *--field* is aliased to *-f*, therefore
`fleet-stopregex --field command` = `fleet-stopregex -f command`

# Examples

**Stop PID**
Same as vanilla fleet-stop. However fleet-stopregex will retry the stop command until it succeeds
```bash
fleet-stopregex pid#b0a13c
```

**By Git Commit**
Stop all processes which have an exact commit
```bash
fleet-stopregex --field commit fbdcfba04752fe6f42be6e49461b8d2dec63c31e
```

**Regex Flags**
Flags can be passed as optional last parameter. This flags are the same as you would pass to new RegExp(pattern, flags).

```bash
# stop processes with name both foo or Foo
fleet-stopregex --field command foo i
```
