package main

import (
	"encoding/json"
	"fmt"
	"os"
	"plugin"
	"strconv"
	"time"
)

func main() {
	p, err := plugin.Open("src/drivers/golang/golang.so")
	if err != nil {
		panic(err)
	}
	var solution plugin.Symbol
	for part := 1; part < 100; part++ {
		solution, err = p.Lookup("Part" + strconv.Itoa(part))
		if solution != nil {
			break
		}
	}

	if solution == nil && err != nil {
		panic("Cannot find symbol")
	}
	file := os.Args[1]
	inp, err := os.ReadFile(file)
	if err != nil {
		panic(err)
	}
	start := time.Now()
	rs := solution.(func(string) interface{})(string(inp))
	timeElapsed := time.Since(start)
	payload := map[string]interface{}{
		"result": rs,
		"time":   fmt.Sprint(timeElapsed),
	}
	js, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}
	fd := os.NewFile(3, "ipc")
	_, err = fd.Write([]byte(string(js) + "\n"))
	if err != nil {
		panic(err)
	}
}
