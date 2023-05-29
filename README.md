1. Install minikube

```
minikube start --memory 8192
```

2. Install istio

```
brew install istioctl
istioctl install --set profile=demo -y --set values.global.proxy.privileged=true
```

3. Prepare namespaces

```
kubectl create namespace foo
kubectl create namespace bar
kubectl create namespace legacy

kubectl label namespace foo istio-injection=enabled
kubectl label namespace bar istio-injection=enabled
```

4. Build & deploy foo service:

```
eval $(minikube docker-env)
cd foo
docker build -t foo -f Dockerfile .
kubectl apply -f deployment.yaml
kubectl apply -f peerauth.yaml
```

5. Build & deploy bar service:

```
eval $(minikube docker-env)
cd bar
docker build -t bar -f Dockerfile .
kubectl apply -f deployment.yaml
kubectl apply -f peerauth.yaml
```

6. Build & deploy legacy service:

```
eval $(minikube docker-env)
cd legacy
docker build -t legacy -f Dockerfile .
kubectl apply -f deployment.yaml
```

Results:

```
foo --> foo: ok
foo --> bar: ok
foo --> legacy: ok
bar --> foo: ok
bar --> bar: ok
bar --> legacy: ok
legacy --> foo: error
legacy --> bar: ok
legacy --> legacy: ok
```

7. Use DestinationRule to disable mTLS between bar -> foo

```
cd bar
kubectl apply -f destinationrule.yaml
```

Results:

```
foo --> foo: ok
foo --> bar: ok
foo --> legacy: ok
bar --> foo: error
bar --> bar: ok
bar --> legacy: ok
legacy --> foo: error
legacy --> bar: ok
legacy --> legacy: ok
```

8. Use AuthorizationPolicy to deny request bar -> foo

```
cd bar
kubectl delete -f destinationrule.yaml

cd foo
kubectl apply -f authz.yaml
```

Results:

```
foo --> foo: ok
foo --> bar: ok
foo --> legacy: ok
bar --> foo: denied
bar --> bar: ok
bar --> legacy: ok
legacy --> foo: error
legacy --> bar: ok
legacy --> legacy: ok
```
