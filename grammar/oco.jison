
%start expressions

%%

expressions
  : EOF { return new yy.Entry('root', [], 'Root', @1) }
  | entries {  return new yy.Entry('root', $1, 'Root', @1) } // sometimes EOF is already consumed
  | entries EOF {  return new yy.Entry('root', $1, 'Root', @1) }
  ;

entries
  : entry
  { $$ = [ $1 ];}
  | entries terminators entry
  { $$ = $1; $1.push($3);}
  | entries terminators
  { $$ = $1; }
  ;

entry
  : entryname commentOrNot terminators block
  { $$ = new yy.Entry($1, $4, null, @4);}
  | entryname colorvalues commentOrNot
  { $$ = new yy.Entry($1, $2, 'Color', @2);}
  | entryname reference commentOrNot
  { $$ = new yy.Reference($1, $2);  }
  | metaname commentOrNot terminators metablock
  { $$ = new yy.Entry($1, $4, 'Metablock', @4); }
  | metaname metavalue commentOrNot
  { $$ = new yy.Metadata($1, $2);  }
  | colorvalues commentOrNot
  { $$ = $1; }
  | comment
  { $$ = {type: 'Comment'}}
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
  { $$ = "" + $1;}
  | referenceNames '.' nameparts
  { $$ = $1 + '.' + $3; }
  ;

metaentries
  : metadata
  { $$ = [$1];  }
  | metaentries terminators metadata
  { $$ = $1; $$.push($3) }
  | metaentries terminators
  { $$ = $1; }
  ;

metadata
  : metaname metavalue
  { $$ = new yy.Metadata($1, $2);  }
  | nameparts ':' metavalue
  { $$ = new yy.Metadata($1, $3);  }
  ;

metavalue
  : metavalueparts
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

commentOrNot
  : comment
  |
  ;

comment
  : COMMENTSTART nameparts
  { $$ = $2 }
  | COMMENTSTART STRING
  { $$ = $2 }
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

block
  : INDENT entries outdentOrEof
  { $$ = $2; }
  ;

metablock
  : INDENT metaentries outdentOrEof
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
  { $$ = new yy.ColorValue($1, $1 + "(" + $3.join(",") + ")");}
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

terminators
  : NEWLINE
  ;

outdentOrEof
  : OUTDENT
  | EOF
  ;
