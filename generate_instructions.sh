# generate instructions for initializing free redis store key value pairs
# EXAMPLE USE: ./generate_instructions > instructions.txt

for c1 in {A..Z} {a..z} {0..9}
do
    for c2 in {A..Z} {a..z} {0..9}
    do
        for c3 in {A..Z} {a..z} {0..9}
        do
            for c4 in {A..Z} {a..z} {0..9}
            do
            	echo "SET $c1$c2$c3$c4 0"
            done
        done
    done
done

