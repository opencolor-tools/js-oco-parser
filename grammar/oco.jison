
%start expressions

%%

expressions
  : entries EOF {  return new yy.Entry('root', $1, 'Root', @1) }
  ;

entries
  : entry
  { $$ = [ $1 ]}
  | entries entry
  { $$ = $1; $1.push($2); }
  ;

entry
  : entryname newlines block
  { $$ = new yy.Entry($1, $3, null, @3); }
  | entryname colorvalues newlines
  { $$ = new yy.Entry($1, $2, 'Color', @2); }
  | entryname reference newlines
  { $$ = new yy.Reference($1, $2)}
  | metaname newlines metablock
  { $$ = new yy.Entry($1, $3, 'Metablock', @3); }
  | metaname metavalue newlines
  { $$ = new yy.Metadata($1, $2); }
  | colorvalues newlines
  { $$ = $1 }
  ;

entryname
  : NAME ':'
  { $$ = $1;}
  | NUMBER ':'
  { $$ = $1;}
  | HEXNUMBER ':'
  { $$ = $1;}
  ;

reference
  : '=' referenceNames
  { $$ = $2; }
  ;

referenceNames
  : NAME
  { $$ = $1; }
  | NAME '.' referenceNames
  { $$ = $1 + '.' + $3 }
  ;

metaentries
  : metadata
  { $$ = [$1] }
  | metaentries metadata
  { $$ = $1; $$.push($2) }
  ;

metadata
  : metaname metavalue newlines
  { $$ = new yy.Metadata($1, $3);  }
  | NAME ':' metavalue newlines
  { $$ = new yy.Metadata($1, $3);  }
  ;

metavalue
  : NAME
  { $$ = $1; }
  | NUMBER
  { $$ = parseFloat($1); }
  | boolean
  { $$ = $1; }
  | colorvalue
  { $$ = $1; }
  | reference
  { $$ = new yy.Reference('metachild', $1); }
  ;

metaname
  : metanameparts ':'
  { $$ = $1; }
  ;

metanameparts
  : '/' NAME
  { $$ = '/' + $2 }
  | NAME '/' NAME
  { $$ = $1 + '/' + $3 }
  | '/' NAME '/' metanameparts
  { $$ = '/' + $2 + '/' + $4 }
  | NAME '/' metanameparts
  { $$ = $1 + '/' + $3 }
  | NAME '/'
  { $$ = $1 + '/' }
  ;

newlines
  : NEWLINE
  | NEWLINE newlines
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
  { $$ = new yy.ColorValue($1, $3.join(",")); }
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
