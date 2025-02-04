package authz

import (
	"github.com/casbin/casbin/v2"
	"github.com/thoas/go-funk"
)

type Authorizer struct {
	enforcer *casbin.Enforcer
}

func (authorizer *Authorizer) Authorize(roles []string, resource string, action string) (bool, error) {
	requests := authorizer.convertRequests(
		funk.Map(roles, func(role string) []string {
			return []string{role, resource, action}
		}).([][]string),
	)

	results, err := authorizer.enforcer.BatchEnforce(requests)

	if err != nil {
		return false, err
	}

	return funk.Contains(results, true), nil
}

func (authorizer *Authorizer) convertRequests(requests [][]string) [][]interface{} {
	results := make([][]interface{}, len(requests))

	for i, request := range requests {
		result := make([]interface{}, len(request))
		for j, value := range request {
			result[j] = value
		}
		results[i] = result
	}

	return results
}

func New() (*Authorizer, error) {
	enforcer, err := casbin.NewEnforcer("./assets/casbin/model.conf", "./assets/casbin/policy.csv")

	if err != nil {
		return nil, err
	}

	authorizer := Authorizer{}
	authorizer.enforcer = enforcer

	return &authorizer, nil
}
