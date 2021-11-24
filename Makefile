all:
	@echo "make run				- Run python server for tes prod build"
	@exit 0


run:
	@cd dist && python3 -m http.server 8000
