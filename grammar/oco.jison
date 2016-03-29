
%start expressions

%%

expressions
  : entries EOF {  return new yy.Block('root', $1) }
  ;

entries
  : entry
  { $$ = [ $1 ]}
  | entries entry
  { $$ = $1; $1.push($2); }
  ;

entry
  : entryname newlines block
  { $$ = new yy.Block($1, $3); }
  | entryname colorvalues newlines
  { $$ = new yy.Block($1, $2, 'Color') }
  | entryname reference newlines
  { $$ = new yy.Reference($1, $2)}
  | metaname newlines metablock
  { $$ = new yy.Block($1, $3, 'Metadata'); }
  | metaname metavalue newlines
  { $$ = new yy.Metadata($1, $2); }
  | colorvalues newlines
  { $$ = $1 }
  ;

entryname
  : NAME ':'
  { $$ = $1; }
  ;

reference
  : '=' referenceNames
  { $$ = $2; }
  ;

referenceNames
  : NAME
  { $$ = yytext; }
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
  : NAME ':' metavalue newlines
  { $$ = new yy.Metadata($1, $3);  }
  | metaname ':' metavalue newlines
  { $$ = new yy.Metadata($1, $3);  }
  ;

metaname
  : metanameparts ':'
  { $$ = $1; }
  ;

metavalue
  : NAME
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
