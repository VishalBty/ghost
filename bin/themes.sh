themes=(
	casper
	lyra
	ruby
	liebling
	ease
)

mkdir -p content/themes/
for theme in "${themes[@]}"
do
	cp -Rf "node_modules/$theme" content/themes/$theme
done
