if [ -f contributors ];
then
    rm contributors
fi
for x
in `curl -K contributors.curl | grep -E -w 'url' | grep -o -E 'https[^"]+'`
do
    curl -XGET --url $x -o -| grep -E 'name|html_url' >> contributors
done
