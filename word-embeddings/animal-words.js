// Extracted-from https://en.wikipedia.org/wiki/List_of_English_animal_nouns

var animal_words = 
("alligator  crocodile	bull	cow	hatchling  nestling		bask  congregation	river	pool " +
"alpaca	bull	cow	cria	bray	herd		corral " +
"ant	drone	queen  worker	larva  antling		army  colony  nest  swarm  state  bike	ant hill	insectarium  terrarium  formicarium " +
"antelope	buck	doe	calf  fawn		herd		 " +
"ape	bull	female	baby  infant	gibber  scream	troop  shrewdness	grove	cage " +
"armadillo			pup				 " +
"ass  donkey  burro	jack  jackass	jenny  jennet	colt  foal	bray	pace  drove  herd  coffle		barn  corral " +
"baboon	bull	female	baby  infant	howl	troop  flange	grove	cage " +
"badger	boar	sow	kit  cob		cete  company  colony		 " +
"bat	male	female	bitten		colony  cloud	cave	cage " +
"bear	boar  he-bear	sow  she-bear	cub	growl	sleuth  sloth  slought	den	den " +
"beaver			kit  kitten		family  colony  lodge	dam	pen " +
"bee	drone	queen  worker	larva	buzz  hum	swarm  cluster  grist	hive	hive " +
"beetle			larva	drone			terrarium " +
"buffalo	bull	cow	calf		herd  gang  obstinacy		corral " +
"butterfly			larva  pupa  caterpillar  chrysalis		swarm  flutter  army  caterpillars 		 " +
"camel	bull	cow	calf  colt	grunt	herd  flock  train  caravan		corral " +
"carabao  water buffalo	bull	cow	calf		herd		corral " +
"caribou	bull  stag  hart	doe	calf  fawn	bellow	herd		 " +
"cat	tom  tomcat	pussy  queen	kitten	meow meu  purr  caterwaul	clowder  clutter  pounce  glorying  kindle  kittens   litter  kittens   destruction  wild cats 	den	home " +
"cattle	bull	cow	bull calf  heifer	low  moo  bellow	herd  drove  drift  mob  flink  cows   kine  cows   fold  highland cattle 		barn  corral " +
"cheetah			cub		coalition	den	den " +
"chimpanzee			baby  infant	scream	band  troop	grove	cage " +
"chinchilla	buck	doe	pup		colony	nest	cage " +
"cicada			nymph	buzz	colony	nest	 " +
"clam			larva  littleneck		bed		pool " +
"cockroach			nymph		intrusion	nest	 " +
"cod			codling  hake  sprag  sprat		school  lap		aquarium  pond  tank " +
"coyote	dog	bitch	cub  pup  puppy  whelp	howl	pack  rout	den	den " +
"crab					cast		 " +
"Cricket_ insect 			larva	chirp		nest	 " +
"crow  raven			nestling	caw	congress  murder  unkindness  flock	nest	bird house " +
"deer	buck  stag	doe	fawn		herd  mob  leash		 " +
"dinosaur			hatchling		herd  plant-eaters   pack  flesh-eaters 		 " +
"dog	dog	bitch	pup  puppy  whelp	bark  growl  howl  yelp  whine  arf  bow wow  woof	pack  gang  litter  pups 	den	dog house  kennel " +
"dolphin  porpoise	bull	cow	calf		pod  school  herd  gam	sanctuary	aquarium  tank " +
"duck	drake	duck	duckling	quack	flush  sord	pond  nest	corral " +
"eel			elver  leptocephalus		bed  swarm  bind  draft  school  fry  wisp		aquarium  pond  tank " +
"elephant	bull	cow	calf	trumpet	herd  parade	savannah	enclosure " +
"elk	bull	cow	calf	bellow	gang  herd		 " +
"ferret	hob	jill	kit		business  fesynes		 " +
"fish			spawn  egg  larva  fry  fingerling		shoal  school  catch  haul	sanctuary	aquarium  pond  tank " +
"fly			grub  maggot	buzz	business  cloud  swarm  grist	nest	 " +
"fox	renard  reynard  dog fox  tod	vixen	cub  pup  puppy  whelp	howl  yelp	skulk  leash  brace  troop  earth	den	den " +
"frog  toad			tadpole  polliwog	croak  ribbit	chorus  army  knot	nest	terrarium " +
"gerbil	buck	doe	pup		horde	nest	cage " +
"giraffe	bull	doe	calf  pup		herd  corps  troop  tower	savannah	enclosure " +
"gnat			larva	buzz	cloud  swarm  horde  plague	nest	 " +
"gnu  wildebeest	bull	cow	calf	bellow	herd		 " +
"goat	billy goat	nanny goat	kid	bleat	flock  trip  herd  tribe		barn  corral " +
"goldfish			fry  fingerling		troubling	sanctuary	aquarium  pond  tank " +
"gorilla	bull	female	infant	grunt  scream	band	grove	cage " +
"grasshopper			nymph		cloud  swarm	nest	 " +
"guinea pig	boar	sow	pup		group	nest	cage " +
"hamster	buck	doe	pup		horde	nest	cage " +
"hare	buck	doe	leveret		down  husk	burrow  warren	hutch " +
"hedgehog	boar	sow	piglet		array	nest	pen " +
"herring			fry  fingerling		army	sanctuary	aquarium  pond  tank " +
"hippopotamus	bull	cow	calf	bellow	herd  bloat	river	pen " +
"hornet			larva	buzz	swarm  cloud	nest	 " +
"horse	stallion  stud	mare  dam	foal  colt  male   filly  female 	neigh  snort  whinny	herd  string  set  stud  remuda  harras  rag  team  harnessed   string  race horses   rage  colts   rake  colts 	range	stable  paddock  corral " +
"hound	dog	bitch	pup  puppy  whelp	bark  howl  bay	pack  cry  sute  mute	den	dog house  kennel " +
"hyena			cub  pup  whelp	laugh	pack  clan  cackle	den	den " +
"impala	ram	ewe					corral " +
"insect			larva	buzz	swarm  cloud  horde  plague	nest	insectarium  terrarium " +
"jackal		bitch	pup	howl	pack	den	 " +
"jellyfish			planula  polyp  ephyra		squad		aquarium " +
"kangaroo  wallaby	jack  buck  boomer	jill  doe  flyer  roo	joey		mob  troop		 " +
"koala	buck	doe	joey				 " +
"leopard	leopard	leopardess	cub	growl	leap  prowl	den	den " +
"lion	lion	lioness	cub	roar  growl	pride	den	den " +
"lizard					lounge	nest	 " +
"llama			cria		herd		corral " +
"locust			larva	buzz	swarm  cloud  horde  plague  host	nest	 " +
"louse			nit  nymph		colony  infestation		 " +
"mallard	drake	duck	duckling	quack	flush  sord	nest	 " +
"mammoth	bull	cow			herd  tusk		 " +
"manatee	bull	cow			pod		aquarium  pond " +
"marten					richness		 " +
"mink	boar	sow	kit  cub			den	 " +
"minnow			fry  fingerling		shoal  school  steam  swarm		 " +
"mole			pup		company  labour	nest	cage " +
"monkey			infant	chatter  gibber  howl  scream	troop  barrel  cartload  tribe	grove	cage " +
"moose	bull	cow	calf	bellow	herd		 " +
"mosquito			wriggler  nymph  tumbler		scourge  swarm  cloud  horde		 " +
"mouse  rat	buck	doe	pinkie  pup  kitten	squeak	horde  colony  swarm  mischief	nest	cage " +
"mule	john	molly	foal	bray	span  barren  pack  rake  team  harnessed 		barn  corral " +
"muskrat			kit				cage " +
"otter	dog	bitch	pup  whelp		family  lodge  bevy  romp  raft		 " +
"ox	bullock  steer	cow	calf  stot	low  bellow	drove  herd  yoke  harnessed   team  harnessed 		barn  corral " +
"oyster			spat  set seed		bed  cast		pool " +
"panda	boar	sow	cub		cupboard	den	den " +
"pig  hog  swine  wild pig	boar	sow	piglet  shoat  farrow	grunt  squeal	herd  sounder  drove  drift  trip  litter  piglets 	sty	sty pigsty  pen pigpen " +
"platypus			puggle		colony		 " +
"porcupine					prickle		cage " +
"prairie dog	boar	sow	pup		coterie  town		 " +
"pug	dog	bitch	puppy	bark	grumble	den	dog house " +
"rabbit	buck	doe	bunny		husk  colony	burrow  warren	hutch " +
"raccoon	boar	sow	kit  cub		nursery  gaze		 " +
"reindeer	buck	doe	fawn		herd		 " +
"rhinoceros	bull	cow	calf		crash  herd		 " +
"salmon			smolt		school  run  bind		aquarium  pond  tank " +
"sardine			fry		family  shoal  school	sanctuary	aquarium  pond  tank " +
"scorpion					bed  nest	nest	 " +
"seal  sea lion	bull	cow	pup	bark	herd  pod  harem  rookery  trip	den	den " +
"serval			kitten			den	den " +
"shark	bull	female	cub  pup		shiver  shoal  school		aquarium  tank " +
"sheep	ram	ewe	lamb  lambkin  cosset	baa  bleat	!mob!  flock  herd  drove  drift  trip  hurtle  hirsel		corral " +
"skunk	boar		kit  kitten		surfeit		cage " +
"snail					rout  walk		terrarium " +
"snake			hatchling  nestling	hiss	bed  knot	nest  pit	terrarium " +
"spider			spiderling		cluster  clutter	web  cobweb	terrarium " +
"squirrel	buck	doe	pup  kit		dray  colony  scurry		 " +
"swan	cob	pen	swanling  cygnet		bank  bevy  flight  game  herd  wedge		 " +
"termite	drone	queen  worker	larva  nymph		colony  swarm	hill	terrarium " +
"tiger	tiger	tigress	cub	growl  roar	ambush  streak	den	den " +
"trout			fingerling		hover	sanctuary	aquarium  pond  tank " +
"turtle  tortoise			hatchling		bale  dole  dule		terrarium  pond  tank " +
"walrus	bull	cow	calf  cub	howl	herd  pod  huddle	sanctuary	 " +
"wasp	drone	queen  worker	larva	buzz	swarm  colony	nest	 " +
"weasel	buck  hob  jack  dog	bitch  doe  jill	kit		gang  pack	den	cage " +
"whale	bull	cow	calf	sing	pod  gam  herd	sanctuary	aquarium  tank  pool " +
"wolf	he-wolf  dog	she-wolf  bitch	cub  pup  puppy  whelp	howl	pack  rout  route	den	den " +
"wombat	jack	jill	joey		mob		 " +
"woodchuck	he-chuck	she-chuck	kit  cob		colony	hole	 " +
"worm					bunch  clat  clew  bed		terrarium " +
"yak	bull	cow	calf	bellow	herd  team  harnessed 		barn  pen " +
"yellowjacket	drone	queen	larva	buzz	cloud  swarm  colony		 " +
"zebra	stallion	mare	foal  colt  male 	neigh	herd  zeal  cohorts  crossing	savannah	enclosure ").split(" ") ;

