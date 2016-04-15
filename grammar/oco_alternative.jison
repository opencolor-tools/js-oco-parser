%start expressions

%%

expressions
  : entries EOF {  return new yy.Entry('root', $1, 'Root', @1) }
  ;

entries
  : entry
  { $$ = [ $1 ]; }
  | entries entry
  { $$ = $1; $1.push($2); }
  | entries terminators
  { $$ = $1; }
  ;

entry
  : entryname terminators block
  { $$ = new yy.Entry($1, $3, null, @3); }
  | entryname colorvalues terminators
  { $$ = new yy.Entry($1, $2, 'Color', @2); }
  | entryname reference terminators
  { $$ = new yy.Reference($1, $2)}
  | metaname terminators metablock
  { $$ = new yy.Entry($1, $3, 'Metablock', @3); }
  | metaname metavalue terminators
  { $$ = new yy.Metadata($1, $2); }
  | colorvalues terminators
  { $$ = $1 }
  ;

namepart
  : NAME
  { $$ = $1;}
  | NUMBER
  { $$ = $1;}
  | HEXNUMBER
  { $$ = $1;}
  ;

nameparts
  : namepart
  { $$ = $1;}
  | nameparts namepart
  { $$ = $1 + ' ' + $2 }
  ;

entryname
  : nameparts ':'
  { $$ = $1;}
  ;

reference
  : '=' referenceNames
  { $$ = $2; }
  ;

referenceNames
  : nameparts
  { $$ = "" + $1; }
  | nameparts '.' referenceNames
  { $$ = $1 + '.' + $3 }
  ;

metaentries
  : metadata
  { $$ = [$1] }
  | metaentries metadata
  { $$ = $1; $$.push($2) }
  ;

metadata
  : metaname metavalue terminators
  { $$ = new yy.Metadata($1, $2);  }
  | nameparts ':' metavalue terminators
  { $$ = new yy.Metadata($1, $3);  }
  ;

metavalue
  : metavalueparts
  { $$ = $1;}
  | NUMBER
  { $$ = parseFloat($1); }
  | boolean
  { $$ = $1; }
  | colorvalue
  { $$ = $1; }
  | reference
  { $$ = new yy.Reference('metachild', $1); }
  ;

metavalueparts
  : NAME
  { $$ = $1;}
  | HEXNUMBER
  { $$ = $1;}
  | metavalueparts NAME
  { $$ = $1 + " " + $2 }
  | metavalueparts NUMBER
  { $$ = $1 + " " + $2 }
  | metavalueparts HEXNUMBER
  { $$ = $1 + " " + $2 }
  ;

metaname
  : metanameparts ':'
  { $$ = $1; }
  ;

comment
  : COMMENTSTART nameparts
  | COMMENTSTART STRING
  ;

metanameparts
  : '/' nameparts
  { $$ = '/' + $2 }
  | nameparts '/' nameparts
  { $$ = $1 + '/' + $3 }
  | '/' nameparts '/' metanameparts
  { $$ = '/' + $2 + '/' + $4 }
  | nameparts '/' metanameparts
  { $$ = $1 + '/' + $3 }
  | nameparts '/'
  { $$ = $1 + '/' }
  ;

terminators
  : NEWLINE
  | comment terminators
  ;


block
  : INDENT entries OUTDENT
  { $$ = $2;}
  ;

metablock
  : INDENT metaentries OUTDENT
  { $$ = $2; }
  ;

colorvalues
  : colorvalue
  { $$ = [$1] }
  | colorvalues ',' colorvalue
  { $$ = $1; $1.push($2); }
  ;

hexnum
  : HEXNUMBER
  { $$ = yytext; }
  ;

colorvalue
  : '#' hexnum
  { $$ = new yy.ColorValue('rgb', "#" + $2); }
  | '#' NUMBER
  { $$ = new yy.ColorValue('rgb', "#" + $2); }
  | NAME '(' colorvaluevalues ')'
  { $$ = new yy.ColorValue($1, $1 + "(" + $3.join(",") + ")"); }
  ;

colorvaluevalues
  : colorvaluevalue
  { $$ = [$1]; }
  | colorvaluevalues ',' colorvaluevalue
  { $$ = $1; $$.push($3); }
  ;

colorvaluevalue
  : NUMBER
  | NAME
  ;

boolean
  : TRUE
  { $$ = true; }
  | FALSE
  { $$ = false; }
  ;
