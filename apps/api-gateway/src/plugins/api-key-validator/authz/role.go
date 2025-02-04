package authz

import (
	"api-key-validator/utils"
	"errors"
	"net/http"
	"strings"
)

var roleHeaderName = "X-User-Roles"

func SetRolesHeader(header *http.Header, roles []string) {
	header.Set(roleHeaderName, strings.Join(roles, ","))
}

func GetRolesHeader(req utils.RequestWrapper) ([]string, error) {
	headers := req.Headers()
	roleHeaders, ok := headers[roleHeaderName]

	if !ok {
		return nil, errors.New("cannot identify roles")
	}

	roleString := roleHeaders[0]
	roles := strings.Split(roleString, ",")

	return roles, nil
}
